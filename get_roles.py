import urllib.request
import urllib.parse
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

names = [
    "Abhaya Mattoo Rawat", "Akshay Saraswat", "Anshu Sharma", "Deepak Tolani",
    "Jyoti Gupta", "Kammaljit Deka", "Pavan Kumar Galiveeti", "Prashant Kumar",
    "Ravi Chhetri", "Sameer Kulkarni", "Satya Teppala", "Sourabh Pandey",
    "Sreeram Narayan", "Tanvi Sethia"
]

results = []
for name in names:
    try:
        url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(name + ' linkedin product')
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
        
        snippet = ""
        if 'result__snippet' in html:
            start = html.find('class="result__snippet')
            start = html.find('>', start) + 1
            end = html.find('</a>', start)
            snippet = html[start:end].replace('<b>', '').replace('</b>', '').strip()
        
        results.append({"name": name, "snippet": snippet})
    except Exception as e:
        results.append({"name": name, "snippet": str(e)})

with open('fame_raw.json', 'w') as f:
    json.dump(results, f, indent=2)
print("Done")
