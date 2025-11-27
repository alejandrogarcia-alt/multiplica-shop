import { MLProduct, SearchFilters } from '@/types';

export function extractFiltersFromProducts(products: MLProduct[]): SearchFilters {
    if (!products || products.length === 0) {
        return {};
    }

    // Extract prices
    const prices = products.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Extract brands
    // Assuming brand is part of the title or we can infer it.
    // For better accuracy, we should have a brand field, but for now we'll extract from title
    // Common brands list to check against with aliases
    const brandMapping: { [key: string]: string[] } = {
        'Apple': ['apple', 'iphone'],
        'Samsung': ['samsung', 'galaxy'],
        'Xiaomi': ['xiaomi', 'redmi', 'poco'],
        'Motorola': ['motorola', 'moto'],
        'Google': ['google', 'pixel'],
        'OnePlus': ['oneplus', 'one plus'],
        'Nothing': ['nothing'],
        'Huawei': ['huawei'],
        'Honor': ['honor'],
        'Oppo': ['oppo'],
        'Realme': ['realme'],
        'Vivo': ['vivo']
    };

    const brands = new Set<string>();
    products.forEach(p => {
        const title = p.title.toLowerCase();
        for (const [brandName, aliases] of Object.entries(brandMapping)) {
            if (aliases.some(alias => title.includes(alias))) {
                brands.add(brandName);
                break; // Una vez que encontramos la marca, no seguir buscando
            }
        }
    });

    // Extract RAM
    const ramOptions = new Set<string>();
    products.forEach(p => {
        if (p.specs?.ram) {
            ramOptions.add(p.specs.ram);
        } else {
            // Try to extract from title if specs not available
            const ramMatch = p.title.match(/(\d+)\s*GB\s*RAM/i) || p.title.match(/(\d+)\s*GB/i); // Fallback for simple GB
            // Be careful with storage vs RAM. Usually RAM is smaller. 
            // Let's rely mostly on specs or explicit "RAM" keyword for now to avoid confusion with storage
            if (p.title.match(/(\d+)\s*GB\s*RAM/i)) {
                ramOptions.add(p.title.match(/(\d+)\s*GB\s*RAM/i)![0]);
            }
        }
    });

    // Extract Storage
    const storageOptions = new Set<string>();
    products.forEach(p => {
        if (p.specs?.storage) {
            storageOptions.add(p.specs.storage);
        } else {
            // Try to extract from title
            // Storage usually 64GB, 128GB, 256GB, 512GB, 1TB
            const storageMatch = p.title.match(/(\d+)\s*(GB|TB)/i);
            if (storageMatch) {
                // Simple heuristic: if > 32 it's likely storage (unless it's very high end RAM, but 32GB RAM is rare in phones)
                const val = parseInt(storageMatch[1]);
                const unit = storageMatch[2].toUpperCase();
                if (unit === 'TB' || (unit === 'GB' && val >= 32)) {
                    storageOptions.add(storageMatch[0]);
                }
            }
        }
    });

    return {
        price: { min: minPrice, max: maxPrice },
        brands: Array.from(brands).sort(),
        ram: Array.from(ramOptions).sort((a, b) => {
            // Sort logic for RAM (numeric)
            const getVal = (s: string) => parseInt(s.replace(/\D/g, ''));
            return getVal(a) - getVal(b);
        }),
        storage: Array.from(storageOptions).sort((a, b) => {
            // Sort logic for Storage
            const getVal = (s: string) => {
                if (s.includes('TB')) return parseInt(s.replace(/\D/g, '')) * 1024;
                return parseInt(s.replace(/\D/g, ''));
            };
            return getVal(a) - getVal(b);
        })
    };
}
