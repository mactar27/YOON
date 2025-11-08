import { useState } from 'react';
import { CreditCard, Plus, Edit2, Trash2, Check, AlertCircle, Wallet, Smartphone } from 'lucide-react';
import Header from '../components/Header';

type PaymentMethod = {
  id: string;
  type: 'card' | 'mobile_money' | 'bank_transfer';
  name: string;
  details: string;
  isDefault: boolean;
  icon: string;
};

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Carte Visa',
      details: '**** **** **** 1234',
      isDefault: true,
      icon: '💳'
    },
    {
      id: '2',
      type: 'mobile_money',
      name: 'Orange Money',
      details: '+221 77 123 45 67',
      isDefault: false,
      icon: '📱'
    },
    {
      id: '3',
      type: 'bank_transfer',
      name: 'Virement bancaire',
      details: 'Compte courant',
      isDefault: false,
      icon: '🏦'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'card' as 'card' | 'mobile_money' | 'bank_transfer',
    name: '',
    details: ''
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="w-5 h-5" />;
      case 'mobile_money': return <Smartphone className="w-5 h-5" />;
      case 'bank_transfer': return <Wallet className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'card': return 'Carte bancaire';
      case 'mobile_money': return 'Mobile Money';
      case 'bank_transfer': return 'Virement bancaire';
      default: return 'Autre';
    }
  };

  const setAsDefault = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const deleteMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
  };

  const addPaymentMethod = () => {
    if (!newMethod.name || !newMethod.details) return;

    const paymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: newMethod.type,
      name: newMethod.name,
      details: newMethod.details,
      isDefault: paymentMethods.length === 0,
      icon: getTypeIcon(newMethod.type).props.className
    };

    setPaymentMethods([...paymentMethods, paymentMethod]);
    setNewMethod({ type: 'card', name: '', details: '' });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#7B8A52]/5 to-white pb-24">
      {/* Header moderne */}
      <Header title="Méthodes de paiement" />
      
      {/* Contenu principal */}
      <div className="px-6 py-6">
        {/* En-tête avec action */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4A3A3A] rounded-2xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#6B4C4C]">Méthodes de paiement</h1>
              <p className="text-sm text-gray-600">
                Gérez vos moyens de paiement pour les consultations
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#6B4C4C] text-white rounded-2xl hover:bg-[#5A3E3E] transition-all duration-200 font-semibold shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>

        {/* Alerte de sécurité */}
        <div className="mb-6 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Paiement sécurisé</p>
              <p>Vos informations de paiement sont chiffrées et stockées de manière sécurisée. Nous ne stockons jamais vos données bancaires complètes.</p>
            </div>
          </div>
        </div>

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#7B8A52]/20 shadow-lg">
            <h3 className="text-lg font-semibold text-[#6B4C4C] mb-4">Ajouter une méthode de paiement</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de paiement
                </label>
                <select
                  value={newMethod.type}
                  onChange={(e) => setNewMethod({...newMethod, type: e.target.value as any})}
                  className="w-full px-4 py-3 border border-[#7B8A52]/30 rounded-2xl focus:ring-2 focus:ring-[#7B8A52] focus:border-[#7B8A52] outline-none transition-all duration-200 bg-white/50"
                >
                  <option value="card">Carte bancaire</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="bank_transfer">Virement bancaire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={newMethod.name}
                  onChange={(e) => setNewMethod({...newMethod, name: e.target.value})}
                  className="w-full px-4 py-3 border border-[#7B8A52]/30 rounded-2xl focus:ring-2 focus:ring-[#7B8A52] focus:border-[#7B8A52] outline-none transition-all duration-200 bg-white/50"
                  placeholder={`Nom de votre ${getTypeLabel(newMethod.type).toLowerCase()}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Détails
                </label>
                <input
                  type="text"
                  value={newMethod.details}
                  onChange={(e) => setNewMethod({...newMethod, details: e.target.value})}
                  className="w-full px-4 py-3 border border-[#7B8A52]/30 rounded-2xl focus:ring-2 focus:ring-[#7B8A52] focus:border-[#7B8A52] outline-none transition-all duration-200 bg-white/50"
                  placeholder={
                    newMethod.type === 'card' ? '**** **** **** 1234' :
                    newMethod.type === 'mobile_money' ? '+221 77 123 45 67' :
                    'Numéro de compte'
                  }
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={addPaymentMethod}
                  className="flex-1 py-3 bg-[#6B4C4C] text-white rounded-2xl hover:bg-[#5A3E3E] transition-all duration-200 font-semibold"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all duration-200 font-semibold"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liste des méthodes de paiement */}
        {paymentMethods.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mb-6">
              <CreditCard className="w-24 h-24 text-[#7B8A52] mx-auto" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#6B4C4C]/20 rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold text-[#6B4C4C] mb-3">
              Aucune méthode de paiement
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Ajoutez une méthode de paiement pour faciliter vos consultations
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#6B4C4C] text-white px-8 py-4 rounded-2xl hover:bg-[#5A3E3E] transition-all duration-200 font-semibold shadow-lg transform hover:scale-105"
            >
              Ajouter une méthode
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-[#7B8A52]/20 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Icône de type */}
                    <div className="w-12 h-12 bg-gradient-to-br from-[#7B8A52]/20 to-[#6B4C4C]/20 rounded-2xl flex items-center justify-center border border-[#7B8A52]/30">
                      {getTypeIcon(method.type)}
                    </div>
                    
                    {/* Informations */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-[#6B4C4C]">{method.name}</h4>
                        {method.isDefault && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Par défaut
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{method.details}</p>
                      <p className="text-xs text-gray-500 mt-1">{getTypeLabel(method.type)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => setAsDefault(method.id)}
                        className="p-2 text-[#6B4C4C] hover:bg-[#7B8A52]/20 rounded-xl transition-colors"
                        title="Définir par défaut"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      className="p-2 text-[#6B4C4C] hover:bg-[#7B8A52]/20 rounded-xl transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMethod(method.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Informations supplémentaires */}
        <div className="mt-8 bg-[#7B8A52]/10 rounded-2xl p-6 border border-[#7B8A52]/20">
          <h3 className="font-semibold text-[#6B4C4C] mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Informations importantes
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#6B4C4C] rounded-full mt-2 flex-shrink-0"></div>
              <span>Les consultations d'experts sont payantes selon leurs tarifs</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#6B4C4C] rounded-full mt-2 flex-shrink-0"></div>
              <span>Vous pouvez utiliser Mobile Money (Orange Money, Free Money) ou cartes bancaires</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#6B4C4C] rounded-full mt-2 flex-shrink-0"></div>
              <span>Les paiements sont sécurisés et vos données sont protégées</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#6B4C4C] rounded-full mt-2 flex-shrink-0"></div>
              <span>Vous recevrez une facture par email après chaque consultation</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}