import { Component, inject, OnInit } from '@angular/core'; 
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { ProductService } from '../services/product.service'; 

@Component({
    standalone: true,
    selector: 'app-product-edit',
    templateUrl: './product-edit.html', 
    styleUrl: './product-edit.css',
    imports: [CommonModule, ReactiveFormsModule, RouterModule] 
    }) 
    export class ProductEditComponent {

        private fb = inject(FormBuilder); 
        private route = inject(ActivatedRoute); 
        private productService = inject(ProductService); 
        router = inject(Router); 

        imagePreview: string | ArrayBuffer | null = null;
        selectedFile: File | null = null;

        // Convertir el ID a número, asegurando que no sea null
        id = Number(this.route.snapshot.paramMap.get('id'));
        
        // Formulario NO-NULO → evita todos los errores de null/undefine
        form = this.fb.nonNullable.group({ 
            name: ['', Validators.required], 
            description: ['', Validators.required], 
            price: [0, [Validators.required, Validators.min(0.01)]],
            imageUrl: ['']
        });
        
        ngOnInit() {
            const id = Number(this.route.snapshot.paramMap.get('id'));

            this.productService.getProduct(id!).subscribe(product => {
            this.form.patchValue(product);
            this.imagePreview = product.imageUrl; // Mostrar imagen actual
        });
    }

        onFileSelected(event: any) {
            const file = event.target.files[0];
            if (!file) return;

            this.selectedFile = file;

            // Preview
            const reader = new FileReader();
            reader.onload = () => this.imagePreview = reader.result as string;
            reader.readAsDataURL(file);

            // 🔥 Subir imagen automáticamente SIN ID
            const formData = new FormData();
            formData.append('image', file);

            this.productService.uploadImage(formData).subscribe({
                next: (res: any) => {
                this.form.patchValue({ imageUrl: res.imageUrl });
                console.log("Imagen subida:", res.imageUrl);
            },
            error: (err: any) => console.error("Error subiendo imagen:", err)
            });
        }

        onSubmit() {
            if (this.form.invalid) return;

            const id = Number(this.route.snapshot.paramMap.get('id'));
            const updatedProduct = this.form.value;

            this.productService.updateProduct(id!, updatedProduct).subscribe({
             next: (res: any) => {
            console.log("Producto actualizado");
            this.router.navigate(['/products']);
            },
        error: (err: any) => console.error("Error actualizando:", err)
    });
 }
}    