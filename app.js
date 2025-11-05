const ProductController = require('./controllers/productController');
const CategoryController = require('./controllers/categoryController');
const Logger = require('./utils/Logger');

class PadariaSystem {
    constructor() {
        this.productController = new ProductController();
        this.categoryController = new CategoryController();
        this.logger = new Logger();
    }

    async init() {
        try {
            console.log('📦 === SISTEMA DA PADARIA ===');
            console.log('🚀 Inicializando sistema...');
            await this.logger.info('Sistema da padaria iniciado');
            await this.createDefaultCategories();
            await this.createSampleProducts();
            await this.demonstrateFeatures();

            console.log('\n✅ Sistema inicializado com sucesso!');
        } catch (error) {
            await this.logger.error('Erro ao inicializar sistema', { error: error.message });
            console.error('❌ Erro ao inicializar', error.message);
        }
    }
    async createDefaultCategories() {
        console.log('\n📁 Criando categorias padrão...');

        const defaultCategories = [
            { name: 'Pães', description: 'Pães frescos e artesanais' },
            { name: 'Doces', description: 'Doces e sobremesas deliciosas' },
            { name: 'Salgados', description: 'Salados assados e fritos' },
            { name: 'Bebidas', description: 'Bebidas quentes e frias' }
        ];

        for (const categoryData of defaultCategories) {
            try {
                await this.categoryController.createCategory(categoryData);
                await this.logger.success(`Categoria criada: ${categoryData.name}`);
            } catch (error) {
                if (error.message.includes('já existe')) {
                    console.log(`⚠️ Categoria "${categoryData.name}" já existe`);
                } else {
                    await this.logger.error(`Erro ao criar categoria ${categoryData.name}`, { error: error.message })
                }
            }
        }
    }

    async createSampleProducts() {
        console.log('\n🍞 Criando produtos de exemplo...');

        const sampleProducts = [
            { name: 'Pão Francês', price: 0.5, category: 'Pães', description: 'Pão francês tradicional ' },
            { name: 'Pão de Açúcar', price: 4.5, category: 'Pães', description: 'Pão doce com açúcar ' },
            { name: 'Brigadeiro', price: 2.0, category: 'Doces', description: 'Brigadeiro tradicional ' },
            { name: 'Coxinha', price: 3.5, category: 'Salgados', description: 'Coxinha de frango tradicional ' },
            { name: 'Café Expresso', price: 2.5, category: 'Bebidas', description: 'Café expresso tradicional' }
        ];
        for (const productData of sampleProducts) {
            try {
                await this.productController.createProduct(productData);
                await this.logger.success(`Produto criado: ${productData.name}`);
            } catch (error) {
                await this.logger.error(`Erro ao criar produto ${productData.name}`, { error: error.message });
            }
        }
    }

    async demonstrateFeatures() {
        console.log('\n🎯 Demonstrando funcionalidades...')
        try {
            // listar todos os produtos
            console.log('\n📋 todos os produtos:');
            const allProducts = await this.productController.getAllProducts();
            allProducts.forEach(product => {
                console.log(`- ${product.name} - R$ ${product.price.toFixed(2)}`);
            });

            // listar todas as categorias
            console.log('\n 📁 todas as categorias:');
            const allCategories = await this.categoryController.getAllCategories();
            allCategories.forEach(category => {
                console.log(`- ${category.name}`);
            });

            // listar produtos por categoria
            console.log('\n 🍞 produtos por categoria "Móveis":');
            const productsByCategory = await this.productController.getProductsByCategory("Móveis");
            productsByCategory.forEach(product => {
                console.log(`- ${product.name} - R$ ${product.price.toFixed(2)}`);
            });

            // atualizar valores de preço
            console.log('\n ✏️ Atualizar valores de preço');
            const updatedProducts = await allProducts.map(async (product) => {
                if (product.price < 1000) {
                    product.price = product.price + 10;
                    await this.productController.updateProduct(product);
                }
                return product;
            });

            if (updatedProducts.length > 0) {
                console.log('Produtos atualizados com sucesso!');
            }

            await this.logger.success('Demonstração concluída com sucesso!');
        } catch (error) {
            console.error('X Erro durante demonstração:', error.message);
            console.error('X Erro durante demonstração:', error.message);
        }

    }
    async showMenu(){
        console.log('\n📦 === MENU DO SISTEMA ===');
        console.log('1. Listar todos os produtos');
        console.log('2. Listar todas as categorias');
        console.log('3. Buscar produtos por categoria');
        console.log('4. Criar novo produto');
        console.log('5. Criar nova categoria');
        console.log('6. Ver logs do sistema');
        console.log('0. Sair');
        console.log('==================================');
    }
}  
// Função principal
async function main() {
  const sistema = new PadariaSystem();
  await sistema.init();

  // Exibir menu
  await sistema.showMenu();

  console.log('\n🎉 Obrigado por usar o Sistema da Padaria!');
  console.log('💡 Para interação completa, implemente readline para menu interativo');
}

// Executar apenas se for o arquivo principal
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  });
}

module.exports = PadariaSystem;
