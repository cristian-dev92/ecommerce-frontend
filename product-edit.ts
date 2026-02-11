import { Component, inject, OnInit } from '@angular/core'; 
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { ProductService } from '../services/product.service'; 
import { Product } from '../models/product';

@Component({
     standalone: true,
      selector: 'app-product-edit',
       templateUrl: './product-edit.html', 
       imports: [CommonModule, ReactiveFormsModule, RouterModule] 
    }) 
    export class ProductEditComponent {

        private fb = inject(FormBuilder); 
        private route = inject(ActivatedRoute); 
        private productService = inject(ProductService); 
        router = inject(Router); 

        imagePreview: string | ArrayBuffer | null = null;
        selectedFile: File | null = null;
        
        // Formulario NO-NULO → evita todos los errores de null/undefine
        form = this.fb.nonNullable.group({ 
            name: ['', Validators.required], 
            description: ['', Validators.required], 
            price: [0, [Validators.required, Validators.min(0.01)]],
            imageUrl: ['']
        });
        
        id = Number(this.route.snapshot.paramMap.get('id')); 
        
        ngOnInit() { 
            this.productService.getProduct(this.id).subscribe(product => {
                 this.form.patchValue({
                 name: product.name,
                 description: product.description,
                 price: product.price,
                 imageUrl: product.imageUrl
                }); 

                if (product.imageUrl) { 
                    this.imagePreview = product.imageUrl; 
                }
              });
            } 

            onFileSelected(event: any) { 
                const file = event.target.files[0]; 
                if (!file) return; 

                this.selectedFile = file; 

                const reader = new FileReader(); 
                reader.onload = () => this.imagePreview = reader.result as string; 
                reader.readAsDataURL(file); 
            }

            uploadImage() { 
                if (!this.selectedFile) return; 
                
                const formData = new FormData(); 
                
                formData.append('imageUrl', this.selectedFile); 
                this.productService.uploadImage(formData).subscribe(res => { 
                    this.form.patchValue({ imageUrl: res.imageUrl }); 
                }); 
            }
            
            onSubmit() { 
                if (this.form.invalid) return; 
                
                // Como el formulario es nonNullable, no hay nulls → TypeScript feliz
                const updatedProduct: Partial<Product> = this.form.value;
                this.productService.updateProduct(this.id, updatedProduct).subscribe(() => { 
                    this.router.navigate(['/products']); 
                }); 
            } 
        }