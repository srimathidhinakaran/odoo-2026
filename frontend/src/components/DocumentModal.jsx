import { useState, useEffect } from 'react';
import { fetchDocuments, uploadDocument } from '../services/api';
import { X, UploadCloud, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const DocumentModal = ({ refId, refModel, onClose }) => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState(refModel === 'Vehicle' ? 'Registration' : 'License');

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const { data } = await fetchDocuments(refModel, refId);
      setDocuments(data);
    } catch (err) {
      toast.error('Failed to load documents');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5000000) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setUploading(true);
        await uploadDocument({
          referenceId: refId,
          referenceModel: refModel,
          docType,
          fileBase64: reader.result
        });
        toast.success('Document uploaded!');
        loadDocs();
      } catch (err) {
        toast.error('Upload failed');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass-panel animate-fade-in" style={{ width: '500px', padding: '30px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        <h2 style={{ marginBottom: '20px' }}>{refModel} Documents</h2>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <select 
            value={docType} 
            onChange={e => setDocType(e.target.value)} 
            style={{ padding: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--glass-border)' }}
          >
            {refModel === 'Vehicle' ? (
              <>
                <option value="Registration">Registration</option>
                <option value="Insurance">Insurance</option>
                <option value="Pollution">Pollution Certificate</option>
              </>
            ) : (
              <>
                <option value="License">License Copy</option>
                <option value="ID Proof">ID Proof</option>
              </>
            )}
          </select>
          
          <label className="btn-primary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UploadCloud size={16} />
            {uploading ? 'Uploading...' : 'Upload File'}
            <input type="file" style={{ display: 'none' }} accept="image/*,.pdf" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>

        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {documents.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No documents uploaded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {documents.map(doc => (
                <div key={doc._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={20} color="var(--accent-primary)" />
                    <span>{doc.docType}</span>
                  </div>
                  <a href={doc.fileBase64} download={`${refModel}_${doc.docType}`} style={{ color: 'var(--success)', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
