import os
import zipfile

def create_bundle():
    source_dir = os.path.abspath('deploy/public_html')
    output_zip = os.path.abspath('deploy_bundle.zip')
    
    print(f"Creating zip bundle from {source_dir} -> {output_zip} (skipping vendor/)")
    count = 0
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Skip api/vendor entirely
            if 'vendor' in dirs:
                dirs.remove('vendor')
            if 'node_modules' in dirs:
                dirs.remove('node_modules')
            if '.git' in dirs:
                dirs.remove('.git')
            if 'portfolio_extracted' in dirs:
                dirs.remove('portfolio_extracted')
                
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, source_dir)
                zipf.write(full_path, rel_path)
                count += 1
                
    size_mb = os.path.getsize(output_zip) / (1024 * 1024)
    print(f"Zipped {count} files. Total size: {size_mb:.2f} MB")

if __name__ == '__main__':
    create_bundle()
