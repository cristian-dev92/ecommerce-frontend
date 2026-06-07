import { Component, inject, OnInit, signal, HostListener } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { UiService } from '../services/ui.service'; 
import { OrdersHistory } from './orders-history/orders-history';

@Component({ 
    standalone: true, 
    selector: 'app-profile', 
    templateUrl: './profile.html', 
    styleUrl: './profile.scss', // 👈 Pasado a .scss en singular
    imports: [CommonModule, ReactiveFormsModule, OrdersHistory] 
}) 
export class ProfileComponent implements OnInit {

    auth = inject(AuthService); 
    private fb = inject(FormBuilder); 
    private userService = inject(UserService);
    private ui = inject(UiService);

    // 💡 Signal reactivo para gestionar el estado del usuario
    user = signal<any>(null);
    avatarPreview = signal<string | null>(null);
    isLoading = signal<boolean>(false);
    showAvatarMenu = signal<boolean>(false);
    isConfirmingDelete = signal<boolean>(false);

    // FORMULARIOS NO-NULOS Y SEGUROS
    emailForm = this.fb.nonNullable.group({ 
        email: ['', [Validators.required, Validators.email]] 
    }); 

    passwordForm = this.fb.nonNullable.group({ 
        currentPassword: ['', Validators.required], 
        newPassword: ['', [Validators.required, Validators.minLength(6)]] 
    }); 

    nameForm = this.fb.nonNullable.group({ 
        name: ['', [Validators.required, Validators.minLength(2)]] 
    });

    addressForm = this.fb.nonNullable.group({ 
        address: ['', Validators.required], 
        city: ['', Validators.required], 
        postalCode: ['', Validators.required], 
        province: ['', Validators.required],
        country: ['', Validators.required] 
    });

    ngOnInit() {
        this.loadUserProfile();
    }

    private loadUserProfile() {
        this.isLoading.set(true);
        this.userService.getUserProfile().subscribe({
            next: (userData: any) => {
                this.user.set(userData);
                this.fillForm(userData);
                this.isLoading.set(false);
            },
            error: (err: any) => {
                console.error("Error cargando perfil desde API, usando local:", err);
                // Si falla la API (por ejemplo en local/offline), tiramos del estado síncrono del AuthService
                const localUser = this.auth.currentUser();
                if (localUser) {
                    this.user.set(localUser);
                    this.fillForm(localUser);
                }
                this.isLoading.set(false);
            }
        });
    }

    private fillForm(userData: any) {
        this.nameForm.patchValue({ name: userData.name });
        this.emailForm.patchValue({ email: userData.email });
        this.avatarPreview.set(userData.avatarUrl || null);

        if (userData.address) {
            this.addressForm.patchValue({
                address: userData.address || '',
                city: userData.city || '',
                postalCode: userData.postalCode || '',
                province: userData.province || '',
                country: userData.country || ''
            });
        }
    }

    // 💻 OPCIÓN A: Subir imagen real desde el PC (Binary/Multipart)
    onAvatarSelected(event: any) { 
        const file = event.target.files[0]; 
        if (!file) return; 
        
        // Renderizar la preview instantánea en el cliente
        const reader = new FileReader(); 
        reader.onload = () => this.avatarPreview.set(reader.result as string); 
        reader.readAsDataURL(file); 

        this.isLoading.set(true);

        // Enviamos el archivo binario real directamente (El servicio montará el FormData)
        this.auth.uploadAvatarFile(file).subscribe({
            next: (res: any) => {
                this.ui.success('Imagen de avatar actualizada correctamente');
                if (res?.avatarUrl) {
                    this.updateAvatarLocalState(res.avatarUrl);
                }
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error("Error subiendo avatar:", err);
                this.ui.error('No se pudo subir la imagen desde el ordenador.');
                this.isLoading.set(false);
            }
        }); // ✅ Llaves cerradas limpiamente aquí
    }

    // 🌐 OPCIÓN B: Guardar avatar mediante URL externa (Cloudinary / Internet)
    promptAvatarUrl() {
        this.showAvatarMenu.set(false); 
        const url = prompt("Introduce la URL de tu imagen de Cloudinary o Internet:");
    
        if (!url || !url.trim().startsWith('http')) {
            if (url) this.ui.error('Por favor, introduce una URL válida (http/https)');
            return;
        }

        this.isLoading.set(true);
    
        // Llama al endpoint de JSON plano del backend: /upload-avatar-url
        this.auth.uploadAvatarUrl({ avatarUrl: url.trim() }).subscribe({
            next: (res: any) => {
                this.ui.success('Avatar actualizado desde URL con éxito');
                if (res?.avatarUrl) {
                    this.avatarPreview.set(res.avatarUrl);
                    this.updateAvatarLocalState(res.avatarUrl);
                }
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error("Error al guardar URL de avatar:", err);
                this.ui.error('No se pudo asociar la URL del avatar.');
                this.isLoading.set(false);
            }
        });
    }

    updateName() { 
        if (this.nameForm.invalid) return; 

        this.auth.updateName(this.nameForm.value.name!).subscribe({
            next: () => {
                this.ui.success('Nombre de usuario actualizado');
                this.loadUserProfile(); // Recarga limpia para sincronizar toda la UI
            },
            error: () => this.ui.error('Error al actualizar el nombre')
        });
    }

    updateEmail() { 
        if (this.emailForm.invalid) return; 

        this.auth.updateEmail(this.emailForm.value.email!).subscribe({
            next: () => this.ui.success('Correo electrónico actualizado con éxito'),
            error: () => this.ui.error('Error al actualizar el correo electrónico')
        });
    } 
    
    updatePassword() { 
        if (this.passwordForm.invalid) return; 

        this.auth.updatePassword( 
            this.passwordForm.value.currentPassword!, 
            this.passwordForm.value.newPassword! 
        ).subscribe({
            next: () => {
                this.ui.success('Contraseña cambiada correctamente');
                this.passwordForm.reset();
            },
            error: (err) => this.ui.error(err.error?.message || 'Error al cambiar la contraseña')
        });
    } 
    
    updateAddress() {
        if (this.addressForm.invalid) return;

        // Llamamos a UserService que es donde declaramos este PUT contra Render
        this.userService.updateAddress(this.addressForm.getRawValue()).subscribe({
            next: () => {
                this.ui.success('Dirección de entrega guardada correctamente');
                
                // Refrescamos los datos de sesión para que el Checkout sepa la dirección sin recargar la página
                this.auth.refreshUser().subscribe({
                    next: (updatedUser) => {
                        this.user.set(updatedUser);
                    }
                });
            },
            error: (err) => {
                console.error("Error al guardar la dirección:", err);
                this.ui.error('No se pudo actualizar la dirección en Render.');
            }
        });
    }

    private updateAvatarLocalState(newUrl: string) {
        const currentUser = this.user();
        if (currentUser) {
            currentUser.avatarUrl = newUrl;
            this.user.set({ ...currentUser });
        }

        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        userData.avatarUrl = newUrl;
        localStorage.setItem('user', JSON.stringify(userData));
    }
    
    deleteAccount() { 
    // Si es la primera vez que pulsa, no borramos: activamos el estado de alerta visual
    if (!this.isConfirmingDelete()) {
        this.isConfirmingDelete.set(true);
        this.ui.warning('¡Atención! Has solicitado eliminar tu cuenta. Revisa los avisos antes de continuar.', 4000);
        return;
    }
  
    // Si vuelve a pulsar estando activo, procedemos con la destrucción segura
    this.auth.deleteAccount().subscribe({
      next: () => { 
          this.ui.success('Tu cuenta ha sido eliminada con éxito. Esperamos volver a verte por aquí pronto. ¡Adiós!'); 
          // Nota: tu auth.logout() ya limpia el storage y redirige a /login
          this.auth.logout(); 
      },
      error: (err: any) => {
          this.ui.error('No se ha podido procesar la baja. Por favor, inténtalo de nuevo más tarde.');
          this.isConfirmingDelete.set(false); // Reseteamos el estado por seguridad
          console.error(err);
      }
     });
    }

    // Método extra por si se arrepiente y hace clic fuera
    cancelDeleteAccount() {
        this.isConfirmingDelete.set(false);
    }

    // Abre/Cierra el menú al pulsar el botón
    toggleAvatarMenu(event: Event) {
     event.stopPropagation();
        this.showAvatarMenu.set(!this.showAvatarMenu());
        }   

    // Escuchador global para cerrar el menú si pinchas en cualquier otro lado de la pantalla
    @HostListener('document:click')
    closeAvatarMenu() {
        this.showAvatarMenu.set(false);
    }

}