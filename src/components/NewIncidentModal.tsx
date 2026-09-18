import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { IncidentItem, RegionType } from '../types';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRegion: RegionType;
  onAddIncident: (incident: IncidentItem) => void;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  isOpen,
  onClose,
  currentRegion,
  onAddIncident
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [region, setRegion] = useState<string>(
    currentRegion === 'Toutes les régions' ? 'Kinshasa' : currentRegion
  );
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<IncidentItem['severity']>('Urgent');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newInc: IncidentItem = {
      id: `inc-${Date.now()}`,
      title: title.trim(),
      timeAgo: 'À l instant',
      location: location.trim() || `Dépôt ${region}`,
      region,
      severity,
      description: description.trim(),
      assignedTo: assignedTo.trim() || 'Superviseur de permanence'
    };

    onAddIncident(newInc);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#e4eaf2]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#ffe9ea] text-[#e5484d] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#071b45] text-[17px]">Signaler un Incident Logistique</h3>
              <p className="text-[11px] text-[#718096]">Rupture de stock, panne convoi ou avarie de transport</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-[13px]">
          <div>
            <label className="block font-bold text-[#172033] mb-1">Nature de l'incident / Titre</label>
            <input
              type="text"
              required
              placeholder="Ex: Rupture imminente Primus 33cl ou Retard convoi RN1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border border-[#e4eaf2] rounded-xl bg-[#fafcff] text-[13px] outline-none focus:border-[#e5484d]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#172033] mb-1">Région</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-2.5 border border-[#e4eaf2] rounded-xl bg-[#fafcff] text-[13px] outline-none"
              >
                <option value="Kinshasa">Kinshasa</option>
                <option value="Lubumbashi">Lubumbashi</option>
                <option value="Goma">Goma</option>
                <option value="Kananga">Kananga</option>
                <option value="Kisangani">Kisangani</option>
                <option value="Matadi">Matadi</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#172033] mb-1">Niveau d'Urgence</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full p-2.5 border border-[#e4eaf2] rounded-xl bg-[#fafcff] text-[13px] outline-none"
              >
                <option value="Urgent">Urgent (Action requise &lt; 2h)</option>
                <option value="À suivre">À suivre (Vigilance)</option>
                <option value="Résolu">Résolu (Clôturé)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#172033] mb-1">Localisation précise</label>
            <input
              type="text"
              placeholder="Ex: Dépôt Relais Kingabwa ou Tronçon RN1 Kikwit"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 border border-[#e4eaf2] rounded-xl bg-[#fafcff] text-[13px] outline-none focus:border-[#e5484d]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#172033] mb-1">Description détaillée</label>
            <textarea
              required
              rows={3}
              placeholder="Détaillez le problème, les casiers concernés et les actions immédiates recommandées..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-[#e4eaf2] rounded-xl bg-[#fafcff] text-[13px] outline-none focus:border-[#e5484d]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#172033] mb-1">Superviseur Assigné (Optionnel)</label>
            <input
              type="text"
              placeholder="Ex: Jean-Paul Maluku (Superviseur)"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2.5 border border-[#e4eaf2] rounded-xl bg-[#fafcff] text-[13px] outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#e5484d] hover:bg-[#c93239] text-white rounded-xl text-[13px] font-bold shadow-md transition-colors"
            >
              Enregistrer l'incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
