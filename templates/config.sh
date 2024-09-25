#!/bin/bash

# Função para atualizar o conteúdo do arquivo de configuração
update_config_file() {
    for ext in js mjs cjs; do
        if [ -f "azion.config.$ext" ]; then
            echo "Atualizando azion.config.$ext em $(pwd)"
            
            # Criar arquivo temporário
            tmp_file=$(mktemp)
            
            # Adicionar import no início do arquivo
            echo "import { defineConfig } from 'azion'" > "$tmp_file"
            echo "" >> "$tmp_file"
            
            # Determinar o padrão de exportação
            if grep -q "module.exports" "azion.config.$ext"; then
                export_pattern="module.exports"
            elif grep -q "export default" "azion.config.$ext"; then
                export_pattern="export default"
            else
                echo "Padrão de exportação não reconhecido em $(pwd)/azion.config.$ext"
                return
            fi
            
            # Processar o conteúdo do arquivo
            sed -n "/$export_pattern/,/};/p" "azion.config.$ext" | 
            sed "s/$export_pattern = {/$export_pattern defineConfig({/" |
            sed 's/preset: {/build: { preset: {/' |
            sed '/mode:/d' |
            sed 's/useNodePolyfills/polyfills/g' |
            sed 's/useOwnWorker/worker/g' |
            sed 's/};/});/' >> "$tmp_file"
            
            # Substituir o arquivo original
            mv "$tmp_file" "azion.config.$ext"
            
            echo "Arquivo atualizado com sucesso"
            return
        fi
    done
}

# Função para percorrer diretórios em dois níveis
traverse_two_levels() {
    # Primeiro nível: presets
    for preset in */; do
        if [ -d "$preset" ]; then
            echo "Entrando no preset: $preset"
            (
                cd "$preset"
                # Segundo nível: templates
                for template in */; do
                    if [ -d "$template" ]; then
                        echo "Processando template: $template"
                        (
                            cd "$template"
                            update_config_file
                        )
                    fi
                done
            )
        fi
    done
}

# Início do script
echo "Iniciando a atualização dos arquivos de configuração..."
traverse_two_levels
echo "Processo concluído!"