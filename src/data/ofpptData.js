// ============================================================
// DONNÉES RÉELLES OFPPT / CMC — Maroc
// ============================================================

export const CMC_LIST = [
  { id: 'cmc1', nom: 'CMC Souss-Massa', ville: 'Agadir', places: 3000, filieres: 81, region: 'Souss-Massa' },
  { id: 'cmc2', nom: 'CMC Tanger-Tétouan-Al Hoceima', ville: 'Tanger', places: 3300, filieres: 86, region: 'Tanger-Tétouan-Al Hoceima' },
  { id: 'cmc3', nom: 'CMC Béni Mellal-Khénifra', ville: 'Béni Mellal', places: 2515, filieres: 64, region: 'Béni Mellal-Khénifra' },
  { id: 'cmc4', nom: 'CMC Oriental', ville: 'Nador', places: 2200, filieres: 58, region: 'Oriental' },
  { id: 'cmc5', nom: 'CMC Laâyoune-Sakia El Hamra', ville: 'Laâyoune', places: 1800, filieres: 42, region: 'Laâyoune-Sakia El Hamra' },
  { id: 'cmc6', nom: 'CMC Rabat-Salé-Kénitra', ville: 'Rabat', places: 3100, filieres: 80, region: 'Rabat-Salé-Kénitra' },
  { id: 'cmc7', nom: 'CMC Casablanca-Settat', ville: 'Casablanca', places: 3500, filieres: 92, region: 'Casablanca-Settat' },
  { id: 'cmc8', nom: 'CMC Marrakech-Safi', ville: 'Marrakech', places: 2800, filieres: 72, region: 'Marrakech-Safi' },
  { id: 'cmc9', nom: 'CMC Fès-Meknès', ville: 'Fès', places: 2900, filieres: 76, region: 'Fès-Meknès' },
  { id: 'cmc10', nom: 'CMC Drâa-Tafilalet', ville: 'Errachidia', places: 1500, filieres: 38, region: 'Drâa-Tafilalet' },
  { id: 'cmc11', nom: 'CMC Guelmim-Oued Noun', ville: 'Guelmim', places: 1200, filieres: 32, region: 'Guelmim-Oued Noun' },
  { id: 'cmc12', nom: 'CMC Dakhla-Oued Eddahab', ville: 'Dakhla', places: 1000, filieres: 28, region: 'Dakhla-Oued Eddahab' },
];

export const FILIERES = {
  'Digital & IA': [
    { id: 'f1', code: 'DWFS', nom: 'Développement Digital option Web Full Stack', niveau: 'TS', duree: '2 ans' },
    { id: 'f2', code: 'DMB', nom: 'Développement Digital option Mobile', niveau: 'TS', duree: '2 ans' },
    { id: 'f3', code: 'TDI', nom: 'Techniques de Développement Informatique', niveau: 'TS', duree: '2 ans' },
    { id: 'f4', code: 'DAWM', nom: 'Développeur des Applications Web et Mobiles', niveau: 'TS', duree: '2 ans' },
    { id: 'f5', code: 'IDSR', nom: 'Infrastructure Digitale option Systèmes et Réseaux', niveau: 'TS', duree: '2 ans' },
    { id: 'f6', code: 'DE', nom: 'Data Engineering', niveau: 'TS', duree: '2 ans' },
    { id: 'f7', code: 'CYB', nom: 'Cybersécurité', niveau: 'TS', duree: '2 ans' },
  ],
  'Gestion & Commerce': [
    { id: 'f8', code: 'TSC', nom: 'Technicien Spécialisé en Commerce', niveau: 'TS', duree: '2 ans' },
    { id: 'f9', code: 'TGA', nom: 'Technicien en Gestion Administrative', niveau: 'T', duree: '1 an' },
    { id: 'f10', code: 'CE', nom: 'Comptable d\'entreprise', niveau: 'T', duree: '1 an' },
    { id: 'f11', code: 'GRH', nom: 'Gestionnaire en Ressources Humaines', niveau: 'TS', duree: '2 ans' },
    { id: 'f12', code: 'MD', nom: 'Marketing Digital', niveau: 'TS', duree: '2 ans' },
  ],
  'Industrie': [
    { id: 'f13', code: 'ESA', nom: 'Électromécanique des Systèmes Automatisés', niveau: 'TS', duree: '2 ans' },
    { id: 'f14', code: 'MI', nom: 'Maintenance Industrielle', niveau: 'TS', duree: '2 ans' },
    { id: 'f15', code: 'GM', nom: 'Génie Mécanique', niveau: 'T', duree: '1 an' },
    { id: 'f16', code: 'EI', nom: 'Électricité Industrielle', niveau: 'T', duree: '1 an' },
  ],
  'Tourisme & Hôtellerie': [
    { id: 'f17', code: 'GH', nom: 'Gestion Hôtelière', niveau: 'TS', duree: '2 ans' },
    { id: 'f18', code: 'CUI', nom: 'Cuisine', niveau: 'T', duree: '1 an' },
    { id: 'f19', code: 'SR', nom: 'Service de Restauration', niveau: 'T', duree: '1 an' },
    { id: 'f20', code: 'AT', nom: 'Animation Touristique', niveau: 'TS', duree: '2 ans' },
  ],
  'Santé': [
    { id: 'f21', code: 'TAM', nom: 'Techniques d\'Analyses Médicales', niveau: 'TS', duree: '2 ans' },
    { id: 'f22', code: 'SM', nom: 'Secrétariat Médical', niveau: 'T', duree: '1 an' },
    { id: 'f23', code: 'AMS', nom: 'Assistance Médicale et Sociale', niveau: 'T', duree: '1 an' },
    { id: 'f24', code: 'RAD', nom: 'Radiologie', niveau: 'TS', duree: '2 ans' },
  ],
  'BTP': [
    { id: 'f25', code: 'TGC', nom: 'Technicien en Génie Civil', niveau: 'T', duree: '1 an' },
    { id: 'f26', code: 'DB', nom: 'Dessinateur de Bâtiment', niveau: 'T', duree: '1 an' },
    { id: 'f27', code: 'MV', nom: 'Métreur Vérificateur', niveau: 'TS', duree: '2 ans' },
  ],
  'Agriculture': [
    { id: 'f28', code: 'AM', nom: 'Agriculture Moderne', niveau: 'T', duree: '1 an' },
    { id: 'f29', code: 'AI', nom: 'Agro-Industrie', niveau: 'TS', duree: '2 ans' },
    { id: 'f30', code: 'MEA', nom: 'Maintenance des Équipements Agricoles', niveau: 'T', duree: '1 an' },
  ],
};

export const MODULES_DWFS = {
  '1ere_annee': [
    { id: 'M101', code: 'M101', nom: 'Métier et formation', heures: 30 },
    { id: 'M102', code: 'M102', nom: 'Bases de l\'algorithmique', heures: 90 },
    { id: 'M103', code: 'M103', nom: 'Programmation Orientée Objet', heures: 100 },
    { id: 'M104', code: 'M104', nom: 'Développement de sites web statiques', heures: 80 },
    { id: 'M105', code: 'M105', nom: 'Programmation JavaScript', heures: 100 },
    { id: 'M106', code: 'M106', nom: 'Manipulation de bases de données', heures: 90 },
    { id: 'M107', code: 'M107', nom: 'Développement de sites web dynamiques', heures: 100 },
    { id: 'M108', code: 'M108', nom: 'Méthodes agiles', heures: 40 },
    { id: 'M109', code: 'M109', nom: 'Sécurité des systèmes d\'information', heures: 60 },
  ],
  '2eme_annee': [
    { id: 'M201', code: 'M201', nom: 'Préparation d\'un projet web', heures: 60 },
    { id: 'M202', code: 'M202', nom: 'Développement Front-End (React, Vue, Angular)', heures: 120 },
    { id: 'M203', code: 'M203', nom: 'Développement Back-End (Node.js, PHP, Python)', heures: 120 },
    { id: 'M204', code: 'M204', nom: 'Création d\'applications Cloud native', heures: 80 },
    { id: 'M205', code: 'M205', nom: 'DevOps et Déploiement', heures: 80 },
    { id: 'M206', code: 'M206', nom: 'Tests Unitaires', heures: 60 },
    { id: 'M207', code: 'M207', nom: 'Projet de fin de formation', heures: 200 },
  ],
};

export const ETABLISSEMENTS = [
  { id: 'e1', nom: 'ISTA NTIC Syba', ville: 'Rabat', cmc: 'cmc6' },
  { id: 'e2', nom: 'ISTA Hay Riad', ville: 'Rabat', cmc: 'cmc6' },
  { id: 'e3', nom: 'ISTA Casa-Anfa', ville: 'Casablanca', cmc: 'cmc7' },
  { id: 'e4', nom: 'ISTA Sidi Maârouf', ville: 'Casablanca', cmc: 'cmc7' },
  { id: 'e5', nom: 'ISMONTIC Agadir', ville: 'Agadir', cmc: 'cmc1' },
  { id: 'e6', nom: 'ISTA Tanger', ville: 'Tanger', cmc: 'cmc2' },
  { id: 'e7', nom: 'ISTA Marrakech', ville: 'Marrakech', cmc: 'cmc8' },
  { id: 'e8', nom: 'ISTA Fès-Atlas', ville: 'Fès', cmc: 'cmc9' },
];

export const STATS_NATIONAUX = {
  totalCMC: 12,
  totalFilieres: 260,
  totalStagiaires: 50000,
  totalFormateurs: 8500,
  tauxInsertion: 72,
  etablissements: 380,
};

export const getAllModules = () => {
  const all = [];
  Object.values(MODULES_DWFS).forEach(arr => all.push(...arr));
  return all;
};

export const getAllFilieres = () => {
  const all = [];
  Object.values(FILIERES).forEach(arr => all.push(...arr));
  return all;
};
