import requests
import json
import os
from datetime import datetime

# URL do Backend (Local e Vercel)
# Como estamos operando no workspace, podemos usar o localhost se o backend estiver rodando
# Mas o usuário forneceu o link da Vercel: infra-simulada-backend.vercel.app
BASE_URL = "https://infra-simulada-backend.vercel.app/api"

def backup_config():
    print(f"[*] Iniciando backup da configuração Check Point em {datetime.now()}")
    
    endpoints = {
        "firewall": "/network/firewall",
        "vpn": "/network/vpn",
        "servers": "/servers",
        "alerts": "/monitoring/alerts"
    }
    
    backup_data = {}
    
    for key, endpoint in endpoints.items():
        try:
            print(f"    [-] Coletando {key}...")
            response = requests.get(f"{BASE_URL}{endpoint}")
            if response.status_code == 200:
                backup_data[key] = response.json().get('data', [])
            else:
                print(f"    [!] Erro ao coletar {key}: {response.status_code}")
        except Exception as e:
            print(f"    [!] Exceção ao coletar {key}: {str(e)}")
            
    # Salvar backup localmente
    os.makedirs("backups", exist_ok=True)
    filename = f"backups/checkpoint_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    with open(filename, "w") as f:
        json.dump(backup_data, f, indent=4)
        
    print(f"[+] Backup concluído com sucesso: {filename}")
    return filename

if __name__ == "__main__":
    backup_config()
