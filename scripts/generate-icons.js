import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [192, 512];
const sourceIcon = join(__dirname, '../static/logo/offtrack-logo-source.png');
const outputDir = join(__dirname, '../static/icons');

// Créer les dossiers de sortie s'ils n'existent pas
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Générer les icônes pour chaque taille
sizes.forEach(size => {
  sharp(sourceIcon)
    .resize(size, size)
    .toFile(join(outputDir, `icon-${size}x${size}.png`))
    .then(() => console.log(`Icône ${size}x${size} générée avec succès`))
    .catch(err => console.error(`Erreur lors de la génération de l'icône ${size}x${size}:`, err));
}); 