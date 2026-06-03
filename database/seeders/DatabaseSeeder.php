<?php

namespace Database\Seeders;

use App\Models\Assignation;
use App\Models\Classe;
use App\Models\Presentation;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ─── Formateurs ──────────────────────────────────────────────────────
        $formateur1 = User::create([
            'name'          => 'Ahmed Bennani',
            'email'         => 'formateur@ofppt.ma',
            'password'      => Hash::make('password'),
            'role'          => 'formateur',
            'etablissement' => 'CMC Rabat',
        ]);

        $formateur2 = User::create([
            'name'          => 'Fatima Zahra Alaoui',
            'email'         => 'fz.alaoui@ofppt.ma',
            'password'      => Hash::make('password'),
            'role'          => 'formateur',
            'etablissement' => 'CMC Rabat',
        ]);

        $formateur3 = User::create([
            'name'          => 'Khalid Moujahid',
            'email'         => 'k.moujahid@ofppt.ma',
            'password'      => Hash::make('password'),
            'role'          => 'formateur',
            'etablissement' => 'CMC Rabat',
        ]);

        $formateur4 = User::create([
            'name'          => 'Nadia Cherkaoui',
            'email'         => 'n.cherkaoui@ofppt.ma',
            'password'      => Hash::make('password'),
            'role'          => 'formateur',
            'etablissement' => 'CMC Rabat',
        ]);

        $formateur5 = User::create([
            'name'          => 'Youssef Ezzahiri',
            'email'         => 'y.ezzahiri@ofppt.ma',
            'password'      => Hash::make('password'),
            'role'          => 'formateur',
            'etablissement' => 'CMC Rabat',
        ]);

        // ─── Classes (Digital Pole Taxonomy for CMC Rabat) ─────────────────
        $classesData = [
            // Ahmed Bennani (4 classes)
            ['nom' => 'DEVD101', 'filiere' => 'Développement Digital (1ère année)', 'formateur_id' => $formateur1->id],
            ['nom' => 'DEVOWFS201', 'filiere' => 'Développement Digital option Web Full Stack (2ème année)', 'formateur_id' => $formateur1->id],
            ['nom' => 'DEVOWFS202', 'filiere' => 'Développement Digital option Web Full Stack (2ème année)', 'formateur_id' => $formateur1->id],
            ['nom' => 'DEVOAM201', 'filiere' => 'Développement Digital option Applications Mobiles (2ème année)', 'formateur_id' => $formateur1->id],

            // Fatima Zahra Alaoui (4 classes)
            ['nom' => 'DEVD102', 'filiere' => 'Développement Digital (1ère année)', 'formateur_id' => $formateur2->id],
            ['nom' => 'DEVOWFS203', 'filiere' => 'Développement Digital option Web Full Stack (2ème année)', 'formateur_id' => $formateur2->id],
            ['nom' => 'DEVOWFS204', 'filiere' => 'Développement Digital option Web Full Stack (2ème année)', 'formateur_id' => $formateur2->id],
            ['nom' => 'DEVOAM202', 'filiere' => 'Développement Digital option Applications Mobiles (2ème année)', 'formateur_id' => $formateur2->id],

            // Khalid Moujahid (4 classes)
            ['nom' => 'INFRD101', 'filiere' => 'Infrastructure Digitale (1ère année)', 'formateur_id' => $formateur3->id],
            ['nom' => 'INFRD102', 'filiere' => 'Infrastructure Digitale (1ère année)', 'formateur_id' => $formateur3->id],
            ['nom' => 'IDCS201', 'filiere' => 'Infrastructure Digitale option Cyber sécurité (2ème année)', 'formateur_id' => $formateur3->id],
            ['nom' => 'IDSR201', 'filiere' => 'Infrastructure Digitale option Systèmes et Réseaux (2ème année)', 'formateur_id' => $formateur3->id],

            // Nadia Cherkaoui (4 classes)
            ['nom' => 'DIGD101', 'filiere' => 'Digital Design (1ère année)', 'formateur_id' => $formateur4->id],
            ['nom' => 'DIGD102', 'filiere' => 'Digital Design (1ère année)', 'formateur_id' => $formateur4->id],
            ['nom' => 'DIGDUI201', 'filiere' => 'Digital Design option UI Designer (2ème année)', 'formateur_id' => $formateur4->id],
            ['nom' => 'DIGDUX201', 'filiere' => 'Digital Design option UX Designer (2ème année)', 'formateur_id' => $formateur4->id],

            // Youssef Ezzahiri (4 classes)
            ['nom' => 'IA101', 'filiere' => 'Intelligence Artificielle (1ère année)', 'formateur_id' => $formateur5->id],
            ['nom' => 'IA102', 'filiere' => 'Intelligence Artificielle (1ère année)', 'formateur_id' => $formateur5->id],
            ['nom' => 'IAAD201', 'filiere' => 'Intelligence Artificielle option Assistant Data Analyst (2ème année)', 'formateur_id' => $formateur5->id],
            ['nom' => 'IADC201', 'filiere' => 'Intelligence Artificielle option Développeur Chatbots (2ème année)', 'formateur_id' => $formateur5->id],
        ];

        $classes = [];
        foreach ($classesData as $data) {
            $classes[$data['nom']] = Classe::create([
                'nom'          => $data['nom'],
                'filiere'      => $data['filiere'],
                'formateur_id' => $data['formateur_id'],
            ]);
        }

        // ─── Stagiaires (Dynamic Moroccan Generation) ──────────────────────
        $firstNames = [
            'Youssef', 'Sara', 'Karim', 'Hajar', 'Amine', 'Meryem', 'Ilyas', 'Zineb', 'Hamza', 'Nour',
            'Othmane', 'Chaimae', 'Soufiane', 'Rania', 'Mehdi', 'Imane', 'Ayoub', 'Safae', 'Rachid', 'Amina',
            'Omar', 'Fatima', 'Ismail', 'Houda', 'Yassine', 'Salma', 'Hicham', 'Kawtar', 'Anas', 'Dounia',
            'Tarik', 'Loubna', 'Sami', 'Ghita', 'Mohamed', 'Widad', 'Bilal', 'Abdellatif', 'Mounir', 'Rihab',
            'Zakaria', 'Hanane', 'Adil', 'Kenza', 'Nabil', 'Ihsane', 'Yousra', 'Khalid', 'Manal', 'Saad',
            'Aicha', 'Rahim', 'Siham', 'Fouad', 'Laila', 'Reda', 'Noura', 'Wafae', 'Hind', 'Badr',
            'Najat', 'Mustapha', 'Hamid', 'Soukaina', 'Driss', 'Samira', 'Oualid', 'Hasnaa', 'Leila', 'Anouar',
            'Sabrina', 'Jaouad', 'Meriem', 'Nadia', 'Kaoutar', 'Ibrahim', 'Doha', 'Haitam', 'Samah', 'Ilham',
            'Abdelkrim', 'Sanaa', 'Yassir', 'Wissam'
        ];

        $lastNames = [
            'El Amrani', 'Moussaoui', 'Idrissi', 'Benhaddou', 'Lahlou', 'Sqalli', 'Bensouda', 'Tahiri', 'Ouali', 'Raji',
            'Filali', 'Zerrad', 'Berrada', 'Bouzidi', 'Oussalah', 'Ghazali', 'Tazi', 'Lamrani', 'Amzil', 'Ait Brahim',
            'Benali', 'Khaldi', 'Naciri', 'Benkirane', 'Ziani', 'Sefrioui', 'Bouazza', 'Hajji', 'El Mansouri', 'Fennich',
            'Chraibi', 'Boutaleb', 'Karimi', 'Mansouri', 'Ouazzani', 'Rhouat', 'Sabri', 'Lakhdar', 'Bakkali', 'El Fassi',
            'Bouabid', 'Zemmouri', 'Hajjaj', 'Belghiti', 'Badrane', 'Tahir', 'El Ouazzani', 'Bennis', 'Alami', 'Benchekroun',
            'Bensalem', 'Benhiba', 'Zouhair', 'Essadki', 'Lahlimi', 'Guerraoui', 'Chaoui', 'Echcharif', 'Laaroussi', 'Bennasser',
            'Benmahmoud', 'Berrhali', 'El Filali', 'Ennassiri', 'Lahsini', 'Bouchrit', 'Hajjam', 'Benbrahim', 'Rachidi', 'Hammouchi',
            'Zougari', 'Bouhssini', 'Afilal', 'Alaoui', 'Mernissi', 'Benabdallah', 'El Bakkali', 'Boukhriss', 'Ahlafi', 'Benabbou',
            'Farahi', 'El Idrissi', 'Alj'
        ];

        $usedEmails = [];
        $stagiaireCount = 0;
        $totalStagiairesCreated = 0;
        $allStagiaires = [];

        foreach ($classes as $nom => $classe) {
            $numStagiaires = rand(17, 20);
            $classeStagiaires = [];

            for ($i = 0; $i < $numStagiaires; $i++) {
                if ($nom === 'DEVD101' && $i === 0) {
                    $name = 'Youssef El Amrani';
                    $email = 'stagiaire@ofppt.ma';
                } else {
                    do {
                        $fn = $firstNames[array_rand($firstNames)];
                        $ln = $lastNames[array_rand($lastNames)];
                        $name = $fn . ' ' . $ln;
                        
                        $cleanFn = strtolower(preg_replace('/[^a-zA-Z]/', '', $fn));
                        $cleanLn = strtolower(preg_replace('/[^a-zA-Z]/', '', $ln));
                        $email = substr($cleanFn, 0, 2) . '.' . $cleanLn . $stagiaireCount . '@ofppt.ma';
                        $stagiaireCount++;
                    } while (in_array($email, $usedEmails));
                }

                $usedEmails[] = $email;

                $stagiaire = User::create([
                    'name'          => $name,
                    'email'         => $email,
                    'password'      => Hash::make('password'),
                    'role'          => 'stagiaire',
                    'etablissement' => 'CMC Rabat',
                ]);

                $classeStagiaires[] = $stagiaire;
                $totalStagiairesCreated++;
            }

            // Attach to class
            $classe->stagiaires()->attach(array_map(fn($s) => $s->id, $classeStagiaires));
            $allStagiaires[$nom] = $classeStagiaires;
        }

        // ─── Présentations (Mapped to Filière Templates) ────────────────────
        $presentationTemplates = [
            'Développement Digital (1ère année)' => [
                [
                    'titre' => 'Bases de l\'Algorithmique',
                    'description' => 'Comprendre les variables, les conditions, les boucles et les fonctions. Écrire des pseudo-codes et les implémenter en JavaScript.',
                ],
                [
                    'titre' => 'HTML5 et CSS3 Fondamentaux',
                    'description' => 'Structure d\'une page web, balises sémantiques, sélecteurs CSS, modèle de boîte et bases du responsive design avec Flexbox.',
                ]
            ],
            'Développement Digital option Web Full Stack (2ème année)' => [
                [
                    'titre' => 'Introduction à Laravel 11',
                    'description' => 'Présenter les concepts fondamentaux de Laravel 11 : routing, controllers, middlewares, Eloquent ORM et migrations. Inclure une démonstration pratique.',
                ],
                [
                    'titre' => 'React JS et les Hooks',
                    'description' => 'Exposé approfondi sur l\'architecture des composants React, la gestion du state avec useState/useReducer, et useEffect.',
                ],
                [
                    'titre' => 'API REST & Authentification Sanctum',
                    'description' => 'Conception et implémentation d\'une API RESTful sécurisée avec Laravel Sanctum, tokens d\'accès et Postman.',
                ]
            ],
            'Développement Digital option Applications Mobiles (2ème année)' => [
                [
                    'titre' => 'Introduction à Flutter et Dart',
                    'description' => 'Comprendre l\'écosystème Flutter, la programmation avec Dart, les Stateless/Stateful Widgets et la gestion basique du state.',
                ],
                [
                    'titre' => 'React Native pour le Mobile',
                    'description' => 'Développement mobile cross-platform avec React Native, composants natifs, navigation et intégration d\'API.',
                ]
            ],
            'Infrastructure Digitale (1ère année)' => [
                [
                    'titre' => 'Architecture des ordinateurs',
                    'description' => 'Composants matériels d\'un ordinateur, rôle du processeur, de la mémoire vive et de la carte mère. Diagnostic de pannes simples.',
                ],
                [
                    'titre' => 'Introduction aux Réseaux Informatiques',
                    'description' => 'Modèle OSI, modèle TCP/IP, adressage IPv4, masques de sous-réseaux et configuration IP de base.',
                ]
            ],
            'Infrastructure Digitale option Cyber sécurité (2ème année)' => [
                [
                    'titre' => 'Sécurité des réseaux et Pare-feu',
                    'description' => 'Architectures de sécurité réseau : DMZ, VPN, IDS/IPS, configuration d\'un pare-feu pfSense et analyse du trafic avec Wireshark.',
                ],
                [
                    'titre' => 'OWASP Top 10 et Pentesting',
                    'description' => 'Introduction aux tests d\'intrusion, la méthodologie PTES et l\'analyse de vulnérabilités web courantes.',
                ]
            ],
            'Infrastructure Digitale option Systèmes et Réseaux (2ème année)' => [
                [
                    'titre' => 'Administration Windows Server & Active Directory',
                    'description' => 'Mise en place d\'un contrôleur de domaine, création d\'utilisateurs, de groupes et configuration des stratégies de groupe (GPO).',
                ],
                [
                    'titre' => 'Configuration des services Linux (DHCP/DNS)',
                    'description' => 'Installation et configuration de services réseau fondamentaux sous Debian/Ubuntu : DHCP et DNS (BIND9).',
                ]
            ],
            'Digital Design (1ère année)' => [
                [
                    'titre' => 'Théorie des Couleurs et Typographie',
                    'description' => 'Comprendre la psychologie des couleurs, les harmonies colorées et le choix des polices pour créer des visuels équilibrés.',
                ],
                [
                    'titre' => 'Bases d\'Adobe Illustrator',
                    'description' => 'Prise en main des outils de dessin vectoriel, tracé à la plume, gestion des calques et création d\'icônes simples.',
                ]
            ],
            'Digital Design option UI Designer (2ème année)' => [
                [
                    'titre' => 'Conception de Design Systems sous Figma',
                    'description' => 'Création de composants réutilisables, gestion des variantes, styles de texte et de couleur globaux pour assurer la cohérence d\'une interface.',
                ],
                [
                    'titre' => 'Prototypage Interactif Avancé',
                    'description' => 'Mise en place de micro-interactions, transitions animées (Smart Animate) et tests d\'utilisabilité sur prototype Figma.',
                ]
            ],
            'Digital Design option UX Designer (2ème année)' => [
                [
                    'titre' => 'Méthodologie de Recherche Utilisateur',
                    'description' => 'Entretiens utilisateurs, questionnaires, création de Personas et cartographie du parcours utilisateur (User Journey Map).',
                ],
                [
                    'titre' => 'Architecture de l\'Information & Wireframes',
                    'description' => 'Tri de cartes, conception d\'arborescences de sites et production de wireframes basse fidélité (Lo-Fi) pour tester des concepts.',
                ]
            ],
            'Intelligence Artificielle (1ère année)' => [
                [
                    'titre' => 'Python pour les Mathématiques',
                    'description' => 'Utilisation de Python pour l\'algèbre linéaire, les probabilités et statistiques de base. Introduction aux notebooks Jupyter.',
                ],
                [
                    'titre' => 'Introduction au Machine Learning',
                    'description' => 'Qu\'est-ce que l\'IA ? Différence entre apprentissage supervisé et non supervisé. Découverte de Scikit-Learn.',
                ]
            ],
            'Intelligence Artificielle option Assistant Data Analyst (2ème année)' => [
                [
                    'titre' => 'Analyse exploratoire des données avec Pandas',
                    'description' => 'Nettoyage de données, agrégations, jointures et manipulation de séries temporelles sous Python Pandas.',
                ],
                [
                    'titre' => 'Visualisation de données et Storytelling',
                    'description' => 'Création de graphiques percutants avec Seaborn/Plotly et construction de dashboards interactifs avec Power BI.',
                ]
            ],
            'Intelligence Artificielle option Développeur Chatbots (2ème année)' => [
                [
                    'titre' => 'Conception de flux conversationnels',
                    'description' => 'Principes du NLU (Natural Language Understanding), gestion des intentions et entités, et design d\'expérience utilisateur pour chatbots.',
                ],
                [
                    'titre' => 'Intégration d\'API LLM & LangChain',
                    'description' => 'Développer un agent conversationnel en connectant des modèles de langage via API (OpenAI/Anthropic) et en utilisant LangChain.',
                ]
            ],
        ];

        $totalPresentationsCreated = 0;

        foreach ($classes as $nom => $classe) {
            $filiere = $classe->filiere;
            $templates = $presentationTemplates[$filiere] ?? [];

            foreach ($templates as $index => $tpl) {
                $pres = Presentation::create([
                    'titre'        => $tpl['titre'],
                    'description'  => $tpl['description'],
                    'date_limite'  => now()->addDays(7 * ($index + 1)),
                    'classe_id'    => $classe->id,
                    'formateur_id' => $classe->formateur_id,
                ]);

                $this->assignPresentation($allStagiaires[$nom], $pres);
                $totalPresentationsCreated++;
            }
        }

        // ─── Résumé ─────────────────────────────────────────────────────────
        $this->command->info('');
        $this->command->info('✅  Base de données OFPPT initialisée avec succès !');
        $this->command->info('');
        $this->command->info('📊  Statistiques :');
        $this->command->info('    • 5 Formateurs créés');
        $this->command->info('    • ' . count($classes) . ' Classes créées (CMC Rabat)');
        $this->command->info('    • ' . $totalStagiairesCreated . ' Stagiaires créés répartis dans les classes');
        $this->command->info('    • ' . $totalPresentationsCreated . ' Présentations créées et assignées');
        $this->command->info('');
        $this->command->info('🔑  Comptes de connexion rapide :');
        $this->command->info('    Formateur : formateur@ofppt.ma  / password');
        $this->command->info('    Stagiaire : stagiaire@ofppt.ma  / password');
        $this->command->info('');
    }

    /**
     * Créer un tableau de stagiaires et retourner leurs instances.
     */
    private function createStagiaires(array $data, string $etablissement): array
    {
        $stagiaires = [];
        foreach ($data as $s) {
            $stagiaires[] = User::create([
                'name'          => $s['name'],
                'email'         => $s['email'],
                'password'      => Hash::make('password'),
                'role'          => 'stagiaire',
                'etablissement' => $etablissement,
            ]);
        }
        return $stagiaires;
    }

    /**
     * Assigner une présentation à un tableau de stagiaires.
     */
    private function assignPresentation(array $stagiaires, Presentation $presentation): void
    {
        foreach ($stagiaires as $stagiaire) {
            Assignation::create([
                'presentation_id' => $presentation->id,
                'stagiaire_id'    => $stagiaire->id,
            ]);
        }
    }
}
