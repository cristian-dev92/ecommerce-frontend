import { Component, inject, signal } from '@angular/core'; 
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { ProductService } from '../services/product.service'; 
import { UiService } from '../services/ui.service';

@Component({ 
    standalone: true, 
    selector: 'app-product-create', 
    templateUrl: './product-create.html', 
    styleUrl: './product-create.scss',
    imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule] 
}) 
export class ProductCreateComponent {
     
    private fb = inject(FormBuilder); 
    private productService = inject(ProductService); 
    private router = inject(Router);
    private ui = inject(UiService);

    imagePreview = signal<string | ArrayBuffer | null>(null);
    selectedFile = signal<File | null>(null);
    isLoading = signal<boolean>(false);
    isSubmitting = signal<boolean>(false);

    // 💡 Añadido el campo 'stock' exigido por tu lógica de negocio del carrito
    form = this.fb.nonNullable.group({ 
        name: ['', [Validators.required, Validators.minLength(3)]], 
        description: ['', Validators.required], 
        price: [0, [Validators.required, Validators.min(0.01)]],
        stock: [1, [Validators.required, Validators.min(0)]],
        discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
        taxes: [21, [Validators.required, Validators.min(0)]],
        imageUrl: ['', Validators.required] 
    }); 

    productForm = signal({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    category: '' // Aquí se guardará lo que elijas en el select
  });

    // Método para actualizar dinámicamente los campos del Signal
     updateFormField(field: string, value: any): void {
        this.productForm.update(current => ({
        ...current,
        [field]: value
        }));
    }

    onFileSelected(event: any) { 
        const file = event.target.files[0]; 
        if (!file) return;

        this.selectedFile.set(file); 
        this.isLoading.set(true);

        const reader = new FileReader(); 
        reader.onload = () => this.imagePreview.set(reader.result); 
        reader.readAsDataURL(file); 

        // Subir imagen automáticamente al backend
        this.productService.uploadImage(0, file).subscribe({
            next: (res: any) => {
                this.form.patchValue({ imageUrl: res.imageUrl });
                this.ui.success('¡Imagen subida y procesada correctamente!');
                this.isLoading.set(false);
            },
            error: (err: any) => {
                console.error("Error subiendo imagen:", err);
                this.ui.error('Error al subir la imagen al servidor.');
                this.isLoading.set(false);
                this.imagePreview.set(null);
            }
        });
    }

    onUrlInput(event: any) {
        const url = event.target.value;
        if (url && url.trim().startsWith('http')) {
            // Actualizamos el signal de vista previa dinámicamente con la URL pegada
            this.imagePreview.set(url);
        } else if (!url) {
            this.imagePreview.set(null);
        }
    }

    onSubmit() {
        if (this.form.invalid || this.isSubmitting() || this.isLoading()) {
            this.ui.warning('Por favor, rellena todos los campos de forma correcta.');
            return;
        }

        this.isSubmitting.set(true);
        const newProduct = this.form.getRawValue();

        this.productService.createProduct(newProduct).subscribe({
            next: () => {
                this.ui.success(`Producto "${newProduct.name}" creado con éxito.`);
                this.isSubmitting.set(false);
                this.router.navigate(['/products']);
            },
            error: (err: any) => {
                console.error("Error creando producto:", err);
                const errorMsg = err.error?.message || 'No tienes permisos para realizar esta acción.';
                this.ui.error(errorMsg);
                this.isSubmitting.set(false);
            }
        });
    }
}