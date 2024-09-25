#!/bin/bash

# Função para detectar o gerenciador de pacotes
detect_package_manager() {
    if [ -f "yarn.lock" ]; then
        echo "yarn"
    elif [ -f "package-lock.json" ]; then
        echo "npm"
    else
        echo "npm"  # Padrão para npm se nenhum arquivo de lock for encontrado
    fi
}

# Função para adicionar azion como dependência
add_azion_dep() {
    if [ -f "package.json" ]; then
        local pkg_manager=$(detect_package_manager)
        echo "Adicionando azion como dependência em $(pwd) usando $pkg_manager"
        if [ "$pkg_manager" = "yarn" ]; then
            yarn add azion --ignore-scripts || echo "Falha ao adicionar azion em $(pwd)"
        else
            npm pkg set dependencies.azion="latest" || echo "Falha ao adicionar azion em $(pwd)"
        fi
    fi
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
                            add_azion_dep
                        )
                    fi
                done
            )
        fi
    done
}

# Início do script
echo "Iniciando a adição da dependência azion em todos os projetos..."
traverse_two_levels
echo "Processo concluído!"