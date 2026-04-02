import requests
import json
import time
from datetime import datetime

# URL do Backend (Simulado)
BASE_URL = "https://infra-simulada-backend.vercel.app/api"

def generate_cef_log(alert):
    """Gera um log no padrão CEF (Common Event Format)"""
    timestamp = alert.get('timestamp', datetime.now().isoformat())
    severity_map = {'critical': '10', 'warning': '7', 'info': '3'}
    sev = severity_map.get(alert.get('severity', 'info'), '1')
    
    cef = f"CEF:0|Check Point|Simulated Firewall|R81.10|{alert.get('id')}|{alert.get('message')}|{sev}|"
    cef += f"rt={timestamp} msg={alert.get('message')} extension=resolved:{alert.get('resolved')}"
    return cef

def siem_collector():
    print(f"[*] Iniciando Coletor SIEM Check Point (Simulado) em {datetime.now()}")
    
    try:
        # Buscar Alertas
        response = requests.get(f"{BASE_URL}/monitoring?resource=alerts")
        if response.status_code == 200:
            alerts = response.json().get('data', [])
            print(f"[+] {len(alerts)} eventos coletados. Formatando para SIEM...")
            
            for alert in alerts:
                cef_log = generate_cef_log(alert)
                print(f"    [LOG] {cef_log}")
                
        # Buscar Regras de Firewall para Auditoria
        response = requests.get(f"{BASE_URL}/network?resource=firewall")
        if response.status_code == 200:
            rules = response.json().get('data', [])
            print(f"[+] Auditoria de Políticas: {len(rules)} regras analisadas.")
            for rule in rules:
                if rule.get('action') == 'deny':
                    print(f"    [SIEM-AUDIT] SECURITY_EVENT rule_id={rule.get('id')} action=BLOCK name={rule.get('name')}")

    except Exception as e:
        print(f"[!] Erro na coleta SIEM: {str(e)}")

if __name__ == "__main__":
    siem_collector()
