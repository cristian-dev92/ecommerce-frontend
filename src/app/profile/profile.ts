import { Component, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { AuthService } from '../services/auth.service';
import { OrdersHistory } from './orders-history/orders-history';
import { UserService } from '../services/user.service';


    @Component({ 
    standalone: true, 
    selector: 'app-profile', 
    templateUrl: './profile.html', 
    styleUrls: ['./profile.css'],
    imports: [CommonModule, ReactiveFormsModule, OrdersHistory] 
}) 

    export class ProfileComponent {

    auth = inject(AuthService); 
    fb = inject(FormBuilder); 
    userService = inject(UserService);
    // FORMULARIO EMAIL 
    emailForm = this.fb.group({ 
    email: ['', [Validators.required, Validators.email]] 
}); 

    // FORMULARIO CONTRASEÑA 
    passwordForm = this.fb.group({ 
    currentPassword: ['', Validators.required], 
    newPassword: ['', [Validators.required, Validators.minLength(6)]] 
}); 

    // FORMULARIO DIRECCIÓN 
    nameForm = this.fb.group({ 
    name: ['', Validators.required] 
});
    addressForm = this.fb.group({ 
    street: ['', Validators.required], 
    city: ['', Validators.required], 
    postalCode: ['', Validators.required], 
    country: ['', Validators.required] 
});

    // AVATAR 
    avatarPreview: string | null = null;
        user: any;

    onAvatarSelected(event: any) { 
    const file = event.target.files[0]; 
    if (!file) return; 
    
    const reader = new FileReader(); 
    reader.onload = () => this.avatarPreview = 
    reader.result as string; reader.readAsDataURL(file); 
    
    this.auth.uploadAvatar(file).subscribe(() => { 
        alert('Avatar actualizado'); 
    }); 
} 

    ngOnInit() {
    // 1. Intentamos cargar desde la API para tener los datos más recientes (incluida la dirección)
    this.userService.getUserProfile().subscribe({
        next: (user: any) => {
        this.user = user;
        this.fillForm(user);
    },
        error: (err: any) => {
        console.error("Error cargando perfil, usando datos locales:", err);
        // Si falla la API (401), intentamos usar lo que haya en el AuthService
        const localUser = this.auth.user();
        if (localUser) {
            this.user = localUser;
            this.fillForm(localUser);
      }
    }
  });
}

// Crea esta pequeña función de ayuda para no repetir código
fillForm(user: any) {
  this.nameForm.patchValue({ name: user.name });
  this.emailForm.patchValue({ email: user.email });
  this.avatarPreview = user.avatarUrl || null;

  if (user.address) {
    this.addressForm.patchValue({
      street: user.address.street,
      city: user.address.city,
      postalCode: user.address.postalCode,
      country: user.address.country
    });
  }
}
    updateName() { 
    if (this.nameForm.invalid) return; 

    this.auth.updateName(this.nameForm.value.name!) 
        .subscribe(() => alert('Nombre actualizado')); 
        this.ngOnInit(); // Actualizar el formulario con el nuevo nombre
    }

    updateEmail() { 
    if (this.emailForm.invalid) return; 

    this.auth.updateEmail(this.emailForm.value.email!) 
        .subscribe(() => alert('Email actualizado')); 
    } 
    
    updatePassword() { 
        if (this.passwordForm.invalid) return; 
        this.auth.updatePassword( 
            this.passwordForm.value.currentPassword!, 
            this.passwordForm.value.newPassword! 
        ).subscribe(() => alert('Contraseña actualizada')); 
    } 
    
    updateAddress() {
        if (this.addressForm.invalid) return;

        this.auth.updateAddress(this.addressForm.value).subscribe({
            next: () => {
            alert('Dirección guardada correctamente');
      
        // ¡ESTO ES LO IMPORTANTE! 
        // Pedimos los datos nuevos y actualizamos la interfaz sin F5
        this.auth.refreshUser().subscribe({
            next: (updatedUser) => {
            this.user = updatedUser; // Actualizamos la variable local
            console.log("Datos refrescados con éxito");
        }
      });
    },
    error: (err) => {
      console.error("Error al guardar:", err);
      // Si te sale 401 aquí, es que updateAddress no envía el token
        }
      });
    }

    updateAvatar(newUrl: string) {
        if (!newUrl) return;

        this.userService.updateAvatarUrl(newUrl).subscribe({
        next: (res: any) => {
        console.log("¡Avatar actualizado!", res);
      
        // 1. Actualiza la variable que usa el HTML (asumiendo que se llama 'user')
        if (this.user) {
        this.user.avatarUrl = newUrl; 
        }

         // 2. Opcional: Si guardas el usuario en el localStorage para la sesión
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        userData.avatarUrl = newUrl;
        localStorage.setItem('user', JSON.stringify(userData));

        // Ya no necesitas window.location.reload(); 
    },
        error: (err: any) => {
        console.error("Error al actualizar:", err);
        alert("Error: Comprueba que el backend está guardando el dato.");
    }
    });
    }
    
    deleteAccount() { 
        if (!confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción es irreversible.')) return; 
        
        this.auth.deleteAccount().subscribe(() => { 
            alert('Cuenta eliminada'); 
            this.auth.logout(); 
        });
    } 
}