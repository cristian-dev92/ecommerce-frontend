import { Component, inject } from '@angular/core'; 
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { ProductService } from '../services/product.service'; 
import { Product } from '../models/product';

@Component({ 
    standalone: true, 
    selector: 'app-product-create', 
    templateUrl: './product-create.html', 
    imports: [CommonModule, ReactiveFormsModule, RouterModule] 
}) 
export class ProductCreateComponent {
     
    private fb = inject(FormBuilder); 
    private productService = inject(ProductService); 
    router = inject(Router);

    imagePreview: string | ArrayBuffer | null = null;
    selectedFile: File | null = null;

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
        }

         uploadImage() { 
            if (!this.selectedFile){
                 console.error("No hay archivo seleccionado");
                    return;
            } 
                
            const formData = new FormData(); 
            formData.append('imageUrl', this.selectedFile); 
            
            this.productService.uploadImage(formData).subscribe(res => { 
                this.form.patchValue({ imageUrl: res.imageUrl }); 
            }); 
        }

        onSubmit() { 
            if (this.form.invalid) return; 

            const newProduct: Partial<Product> = this.form.value;
            
            this.productService.createProduct(newProduct).subscribe(() => { 
                this.router.navigate(['/products']); 
            }); 
        } 
    }