import { Component, inject, OnInit, signal } from '@angular/core'; 
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { ProductService } from '../services/product.service'; 
import { UiService } from '../services/ui.service'; 

@Component({
    standalone: true,
    selector: 'app-product-edit',
    templateUrl: './product-edit.html', 
    styleUrl: './product-edit.scss', 
    imports: [CommonModule, ReactiveFormsModule, RouterModule] 
}) 
export class ProductEditComponent implements OnInit {

    private fb = inject(FormBuilder); 
    private route = inject(ActivatedRoute); 
    private productService = inject(ProductService); 
    private router = inject(Router); 
    private ui = inject(UiService);

    imagePreview = signal<string | ArrayBuffer | null>(null);
    selectedFile = signal<File | null>(null);
    isLoading = signal<boolean>(false);
    isSubmitting = signal<boolean>(false);

    // Convertir el ID a número de forma segura
    id = Number(this.route.snapshot.paramMap.get('id'));
    
    // Formulario reactivo blindado con campo Stock incluido
    form = this.fb.nonNullable.group({ 
        name: ['', [Validators.required, Validators.minLength(3)]], 
        description: ['', Validators.required], 
        price: [0, [Validators.required, Validators.min(0.01)]],
        stock: [0, [Validators.required, Validators.min(0)]],
        discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
        taxes: [21, [Validators.required, Validators.min(0)]],
        imageUrl: ['', Validators.required]
    });
    
    ngOnInit() {
        if (!this.id || this.id === 0) {
            this.ui.error('ID de producto no válido.');
            this.router.navigate(['/products']);
            return;
        }

        this.isLoading.set(true);
        this.productService.getProduct(this.id).subscribe({
            next: (product) => {
                this.form.patchValue(product);
                this.imagePreview.set(product.imageUrl || null);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error("Error cargando producto:", err);
                this.ui.error('No se pudo recuperar la información del producto.');
                this.isLoading.set(false);
                this.router.navigate(['/products']);
            }
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        this.selectedFile.set(file);
        this.isLoading.set(true);

        const reader = new FileReader();
        reader.onload = () => this.imagePreview.set(reader.result);
        reader.readAsDataURL(file);

        // Envío directo al backend de Render usando el ID del producto que editamos
        this.productService.uploadImage(this.id, file).subscribe({
            next: (res: any) => {
                this.form.patchValue({ imageUrl: res.imageUrl });
                this.ui.success('¡Imagen actualizada en el servidor!');
                this.isLoading.set(false);
            },
            error: (err: any) => {
                console.error("Error subiendo imagen:", err);
                this.ui.error('Error al subir la nueva imagen.');
                this.isLoading.set(false);
            }
        });
    }

    onUrlInput(event: any) {
        const url = event.target.value;
        if (url && url.trim().startsWith('http')) {
            // Actualizamos la vista previa dinámicamente con la URL pegada
            this.imagePreview.set(url);
        } else if (!url) {
            this.imagePreview.set(null);
        }
    }

    onSubmit() {
        if (this.form.invalid || this.isSubmitting() || this.isLoading()) {
            this.ui.warning('Por favor, revisa que no haya campos vacíos o con errores.');
            return;
        }

        this.isSubmitting.set(true);
        const updatedProduct = this.form.getRawValue();

        this.productService.updateProduct(this.id, updatedProduct).subscribe({
            next: () => {
                this.ui.success(`Producto "${updatedProduct.name}" modificado con éxito.`);
                this.isSubmitting.set(false);
                this.router.navigate(['/products']);
            },
            error: (err: any) => {
                console.error("Error actualizando producto:", err);
                this.ui.error('Hubo un error al guardar los cambios en el servidor.');
                this.isSubmitting.set(false);
            }
        });
    }
}