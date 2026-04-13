import { Component, inject } from '@angular/core'; 
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { ProductService } from '../services/product.service'; 

@Component({ 
    standalone: true, 
    selector: 'app-product-create', 
    templateUrl: './product-create.html', 
    styleUrls: ['./product-create.css'],
    imports: [CommonModule, ReactiveFormsModule, RouterModule] 
}) 
export class ProductCreateComponent {
     
    private fb = inject(FormBuilder); 
    private productService = inject(ProductService); 
    router = inject(Router);

    imagePreview: string | ArrayBuffer | null = null;
    selectedFile: File | null = null;
    createdProductId: number = 0;

    form = this.fb.nonNullable.group({ 
        name: ['', Validators.required], 
        description: ['', Validators.required], 
        price: [0, [Validators.required, Validators.min(0.01)]],
        imageUrl: ['', Validators.required] // Added ImageUrl field
    }); 

        onFileSelected(event: any) { 
            const file = event.target.files[0]; 
            if (!file) return;

            this.selectedFile = file; 

            const reader = new FileReader(); 
            reader.onload = () => this.imagePreview = reader.result as string; 
            reader.readAsDataURL(file); 

            //Subir imagen automáticamente SIN ID
            const formData = new FormData();
            formData.append('image', file);

             this.productService.uploadImage(this.createdProductId, file).subscribe({
                next: (res: any) => {
                    // Guardamos la URL en el formulario
                    this.form.patchValue({ imageUrl: res.imageUrl });
                    console.log("Imagen subida correctamente:", res.imageUrl);
                },
                error: (err: any) => {
                    console.error("Error subiendo imagen:", err);
                }
            });
        }

        onSubmit() {
         if (this.form.invalid) {
            console.error("Formulario inválido");
            return;
         }

        const newProduct = this.form.value;

        this.productService.createProduct(newProduct).subscribe({
         next: (res: any) => {
            console.log("Producto creado correctamente");
            this.router.navigate(['/products']);
        },
        error: (err: any) => {
             console.error("Error creando producto:", err);
        }
    });
  }
} 