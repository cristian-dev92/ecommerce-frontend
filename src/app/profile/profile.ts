import { Component, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { AuthService } from '../services/auth.service'; 
import { RouterOutlet } from '@angular/router';
import { OrdersHistory } from './orders-history/orders-history';

    @Component({ 
    standalone: true, 
    selector: 'app-profile', 
    templateUrl: './profile.html', 
    styleUrls: ['./profile.css'],
    imports: [CommonModule, ReactiveFormsModule, RouterOutlet, OrdersHistory] 
}) 

    export class ProfileComponent {
    auth = inject(AuthService); 
    fb = inject(FormBuilder); 
    
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
    // Inicializar email con el usuario cargado 
    const user = this.auth.user(); 

    if (user) { 
        this.nameForm.patchValue({ name: user.name });
        this.emailForm.patchValue({ email: user.email }); 

        if(user.address) {
        this.addressForm.patchValue({ 
            street: user.address.street, 
            city: user.address.city, 
            postalCode: user.address.postalCode, 
            country: user.address.country  
        }); 
    }
    this.avatarPreview = user.avatarUrl || null; 
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
        this.auth.updateAddress(this.addressForm.value) 
        .subscribe(() => alert('Dirección guardada')); 
        this.ngOnInit(); // Actualizar el formulario con los nuevos datos
    } 
    
    
    deleteAccount() { 
        if (!confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción es irreversible.')) return; 
        
        this.auth.deleteAccount().subscribe(() => { 
            alert('Cuenta eliminada'); 
            this.auth.logout(); 
        });
    } 
}