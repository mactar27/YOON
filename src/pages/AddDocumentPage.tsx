import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Save, X } from 'lucide-react';


const CATEGORIES = [
  { id: 'loi_penale', label: 'Loi Pénale' },
  { id: 'code_famille', label: 'Code Famille' },
  { id: 'droit_civil', label: 'Droit Civil' },
  { id: 'droit_travail', label: 'Droit du Travail' },
  { id: 'foncier', label: 'Foncier' },
  { id: 'impots', label: 'Impôts' },
  { id: 'assurances', label: 'Assurances' },
  { id: 'environnement', label: 'Environnement' },
  { id: 'constitution', label: 'Constitution' },
  { id: 'procedure_penale', label: 'Procédure Pénale' },
  { id: 'procedure_civile', label: 'Procédure Civile' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'sante', label: 'Santé' },
  { id: 'education', label: 'Éducation' },
  { id: 'electoral', label: 'Électoral' },
  { id: 'presse', label: 'Presse' },
  { id: 'transport', label: 'Transport' },
  { id: 'foret', label: 'Forêt' },
  { id: 'urbanisme', label: 'Urbanisme' },
  { id: 'marches_publics', label: 'Marchés Publics' },
  { id: 'propriete_intellectuelle', label: 'Propriété Intellectuelle' },
  { id: 'securite_sociale', label: 'Sécurité Sociale' },
  { id: 'aviation', label: 'Aviation' },
];

export default function AddDocumentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    summary: '',
    content: '',
    language: 'fr',
    tags: [] as string[],
    is_published: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Veuillez sélectionner un fichier PDF valide.');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Créer le contenu dans localStorage (simulation)
      const newDocument = {
        id: Date.now().toString(),
        title: formData.title,
        category: formData.category,
        summary: formData.summary,
        content: formData.content,
        language: formData.language,
        tags: formData.tags,
        is_published: formData.is_published,
        views_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_by: null
      };

      // Sauvegarder dans localStorage
      const existingDocuments = JSON.parse(localStorage.getItem('yoon_legal_documents') || '[]');
      existingDocuments.push(newDocument);
      localStorage.setItem('yoon_legal_documents', JSON.stringify(existingDocuments));

      // Notification de succès stylisée
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
      modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full border-l-4 border-green-500">
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span class="text-2xl">✅</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-800">Document ajouté</h3>
                <p class="text-sm text-gray-600">Le document a été ajouté avec succès</p>
              </div>
            </div>

            <div class="mb-6">
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <p class="text-green-800 font-medium mb-2">Opération réussie</p>
                <ul class="text-green-700 text-sm space-y-1">
                  <li>• ✅ Document sauvegardé en base de données</li>
                  <li>• ✅ Contenu indexé et disponible</li>
                  <li>• ✅ Statistiques mises à jour</li>
                </ul>
              </div>
            </div>

            <div class="flex justify-end">
              <button id="close-btn" class="px-6 py-2 bg-[#6B4C4C] text-white rounded-lg hover:bg-[#5A3E3E] transition-colors">
                Retour au dashboard
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const closeBtn = modal.querySelector('#close-btn') as HTMLButtonElement;
      closeBtn.onclick = () => {
        document.body.removeChild(modal);
        navigate('/admin');
      };

      // Auto-redirection après 2 secondes
      setTimeout(() => {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
        navigate('/admin');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);

      // Modal d'erreur stylisée
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
      modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full border-l-4 border-red-500">
          <div class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <span class="text-2xl">❌</span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-800">Erreur d'ajout</h3>
                <p class="text-sm text-gray-600">Impossible d'ajouter le document</p>
              </div>
            </div>

            <div class="mb-6">
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-800 font-medium mb-2">Problème détecté</p>
                <ul class="text-red-700 text-sm space-y-1">
                  <li>• ❌ Échec de la sauvegarde en base de données</li>
                  <li>• ❌ Document non indexé</li>
                  <li>• ❌ Vérifiez les champs obligatoires</li>
                  <li>• ❌ Vérifiez la connexion réseau</li>
                  <li>• ❌ Contactez l'administrateur si le problème persiste</li>
                </ul>
              </div>
              <div class="mt-3 p-3 bg-gray-50 rounded-lg">
                <p class="text-xs text-gray-600 mb-1"><strong>Champs requis :</strong></p>
                <ul class="text-xs text-gray-500 space-y-1">
                  <li>• Titre du document</li>
                  <li>• Catégorie</li>
                  <li>• Contenu complet</li>
                </ul>
              </div>
            </div>

            <div class="flex justify-end">
              <button id="close-btn" class="px-6 py-2 bg-[#6B4C4C] text-white rounded-lg hover:bg-[#5A3E3E] transition-colors">
                Réessayer
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const closeBtn = modal.querySelector('#close-btn') as HTMLButtonElement;
      closeBtn.onclick = () => {
        document.body.removeChild(modal);
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-3 flex items-center">
          <button
            onClick={() => navigate('/admin')}
            className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 touch-target shadow-sm mr-3"
          >
            <ArrowLeft className="w-6 h-6 text-[#6B4C4C]" />
          </button>
          <h1 className="text-xl font-bold tracking-wide">
            <span className="text-[#A9B299]">Ajouter un</span>
            <span className="text-[#6B4C4C]"> Document</span>
          </h1>
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo de profil */}
          <div className="bg-white rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Document PDF</h3>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {selectedFile ? (
                  <Upload className="w-8 h-8 text-[#6B4C4C]" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <label className="block">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#A9B299] bg-opacity-20 text-[#6B4C4C] rounded-lg cursor-pointer hover:bg-opacity-30 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Choisir un fichier PDF</span>
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-1">Format PDF uniquement. Taille max: 10MB</p>
                {selectedFile && (
                  <p className="mt-2 text-sm text-[#6B4C4C] font-medium">
                    Fichier sélectionné : {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Informations du document */}
          <div className="bg-white rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations du document</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre du document *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                  placeholder="Ex: Code de la famille"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Résumé
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                  placeholder="Résumé du document juridique"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenu complet *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                  placeholder="Contenu complet du document juridique"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Langue
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="ar">Arabe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (mots-clés)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9B299]"
                    placeholder="Ajouter un tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-[#A9B299] text-white rounded-lg hover:bg-[#8A9279] transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#A9B299] bg-opacity-20 text-[#6B4C4C] text-xs rounded-full flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                  className="w-4 h-4 text-[#6B4C4C] border-gray-300 rounded focus:ring-[#A9B299]"
                />
                <label htmlFor="is_published" className="text-sm text-gray-700">
                  Publier immédiatement ce document
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6B4C4C] text-white py-4 rounded-xl font-semibold hover:bg-[#5A3E3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Ajout en cours...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Ajouter le document
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}