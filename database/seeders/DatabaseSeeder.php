<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Commercant;
use App\Models\Taxe;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed standard taxes for Lubumbashi markets
        $taxes = [
            [
                'libelle' => "Taxe journalière d'étalage",
                'montant' => 1000.00,
                'frequence' => 'journalier',
            ],
            [
                'libelle' => "Taxe mensuelle d'emplacement",
                'montant' => 10000.00,
                'frequence' => 'mensuel',
            ],
            [
                'libelle' => "Taxe de salubrité publique",
                'montant' => 1500.00,
                'frequence' => 'journalier',
            ],
            [
                'libelle' => "Taxe de stationnement parking",
                'montant' => 2000.00,
                'frequence' => 'journalier',
            ]
        ];

        foreach ($taxes as $taxe) {
            Taxe::create($taxe);
        }

        // 2. Seed different user roles for authentication demo
        Agent::create([
            'nom' => 'Alain Mpoyi (Agent Terrain)',
            'email' => 'agent@kenya.lubumbashi.cd',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'actif' => true,
        ]);

        Agent::create([
            'nom' => 'Clémentine Kyungu (Admin Mairie)',
            'email' => 'admin@kenya.lubumbashi.cd',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'actif' => true,
        ]);

        Agent::create([
            'nom' => 'Super Administrateur Système',
            'email' => 'superadmin@kenya.lubumbashi.cd',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'actif' => true,
        ]);

        // 3. Seed mock merchants representing vendors at the Kenya market
        $commercants = [
            [
                'nom' => 'Jean Mukendi',
                'numero_document' => 'CD-KEN-998822',
                'type_activite' => 'Alimentation / Vivres',
                'emplacement' => 'Pavillon A, Étal 14',
                'actif' => true,
            ],
            [
                'nom' => 'Marie Kabange',
                'numero_document' => 'CD-KEN-112233',
                'type_activite' => 'Habillement / Friperie',
                'emplacement' => 'Pavillon B, Étal 02',
                'actif' => true,
            ],
            [
                'nom' => 'Pierre Ilunga',
                'numero_document' => 'CD-KEN-445566',
                'type_activite' => 'Quincaillerie / Divers',
                'emplacement' => 'Secteur C, Étal 88',
                'actif' => true,
            ],
            [
                'nom' => 'Nathalie Mwamba',
                'numero_document' => 'CD-KEN-778899',
                'type_activite' => 'Alimentation / Vivres',
                'emplacement' => 'Pavillon A, Étal 45',
                'actif' => false, // Inactive profile test
            ],
            [
                'nom' => 'Christian Tshibangu',
                'numero_document' => 'CD-KEN-556677',
                'type_activite' => 'Électronique / Services',
                'emplacement' => 'Étal 105, Allée Centrale',
                'actif' => true,
            ]
        ];

        foreach ($commercants as $commercant) {
            Commercant::create($commercant);
        }
    }
}
