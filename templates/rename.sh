#!/bin/bash

# Função para renomear o arquivo de configuração
rename_config_file() {
    for ext in js mjs cjs; do
        if [ -f "vulcan.config.$ext" ]; then
            echo "Renomeando vulcan.config.$ext para azion.config.$ext em $(pwd)"
            mv "vulcan.config.$ext" "azion.config.$ext" || echo "Falha ao renomear em $(pwd)"
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
                            rename_config_file
                        )
                    fi
                done
            )
        fi
    done
}

# Início do script
echo "Iniciando a renomeação dos arquivos de configuração..."
traverse_two_levels
echo "Processo concluído!"