<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Reçu - {{ $paiement->recu->numero ?? 'N/A' }}</title>
    <style>
        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            color: #000;
            background-color: #fff;
            margin: 0;
            padding: 10px;
            width: 280px; /* Largeur type ticket de caisse thermique */
        }
        .text-center {
            text-align: center;
        }
        .font-bold {
            font-weight: bold;
        }
        .border-dashed {
            border-top: 1px dashed #000;
            margin: 8px 0;
        }
        .flex-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
        }
        .total-box {
            background-color: #f0f0f0;
            padding: 5px;
            font-size: 14px;
            margin-top: 6px;
        }
        .security-hash {
            font-size: 9px;
            color: #555;
            margin-top: 8px;
        }
        @media print {
            body {
                padding: 0;
                margin: 0;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="text-center font-bold">
        RÉPUBLIQUE DÉMOCRATIQUE DU CONGO<br>
        PROVINCE DU HAUT-KATANGA<br>
        COMMUNE DE LA KENYA<br>
        MAIRIE DE LUBUMBASHI
    </div>
    
    <div class="border-dashed"></div>
    
    <div class="text-center font-bold" style="font-size: 13px;">
        REÇU DE TAXE UNIQUE
    </div>
    <div class="text-center font-bold" style="margin-top: 2px;">
        N° {{ $paiement->recu->numero ?? 'N/A' }}
    </div>

    <div class="border-dashed"></div>

    <!-- Details -->
    <div class="flex-row">
        <span>Référence :</span>
        <span class="font-bold">{{ $paiement->reference }}</span>
    </div>
    <div class="flex-row">
        <span>Date/Heure :</span>
        <span>{{ $paiement->date_paiement->format('d/m/Y H:i:s') }}</span>
    </div>
    <div class="flex-row">
        <span>Commerçant :</span>
        <span class="font-bold">{{ $paiement->commercant->nom }}</span>
    </div>
    <div class="flex-row">
        <span>Emplacement :</span>
        <span>{{ $paiement->commercant->emplacement }}</span>
    </div>
    <div class="flex-row">
        <span>N° Doc :</span>
        <span>{{ $paiement->commercant->numero_document }}</span>
    </div>
    
    <div class="border-dashed"></div>
    
    <div class="flex-row">
        <span>Type Taxe :</span>
        <span class="font-bold">{{ $paiement->taxe->libelle }}</span>
    </div>
    <div class="flex-row">
        <span>Paiement :</span>
        <span class="font-bold">CASH (Espèces)</span>
    </div>
    <div class="flex-row">
        <span>Percepteur :</span>
        <span>{{ $paiement->agent->nom }}</span>
    </div>

    <div class="border-dashed"></div>

    <div class="flex-row total-box font-bold">
        <span>MONTANT PERÇU :</span>
        <span>{{ number_format($paiement->montant, 0, ',', ' ') }} FC</span>
    </div>

    <div class="border-dashed"></div>
    
    <div class="text-center security-hash">
        Hash de sécurité :<br>
        {{ sha1($paiement->reference) }}<br>
        <br>
        <em>Merci pour votre contribution civique.</em>
    </div>

    <div class="text-center no-print" style="margin-top: 20px;">
        <button onclick="window.print()" style="padding: 6px 12px; font-weight: bold; cursor: pointer;">Imprimer</button>
        <button onclick="window.close()" style="padding: 6px 12px; cursor: pointer; margin-left: 5px;">Fermer</button>
    </div>

    <!-- Auto-print on load -->
    <script>
        window.addEventListener('DOMContentLoaded', (event) => {
            // Auto trigger print dialogue for thermal receipt printers
            setTimeout(() => {
                window.print();
            }, 500);
        });
    </script>
</body>
</html>
