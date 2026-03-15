const fs = require('fs');
const file = 'src/app/dashboard/profile/page.js';
let content = fs.readFileSync(file, 'utf8');

const search = `  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Logo image must be smaller than 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };`;

const replace = `  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Logo image must be smaller than 2MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Logo = reader.result;
        setFormData(prev => ({ ...prev, logoUrl: base64Logo }));

        // Immediately save logo to backend
        try {
            // We can just call updateProfileDataAction with a partial update if we adapt it,
            // or call it with current formData + new logo. Since formData might have unsaved text changes,
            // we will pass the exact updated formData state.
            const dataToSave = { ...formData, logoUrl: base64Logo };
            const res = await updateProfileDataAction(dataToSave);
            if (res.success) {
                setMessage({ type: 'success', text: 'Logo updated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to save logo.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to upload logo.' });
        }
      };
      reader.readAsDataURL(file);
    }
  };`;

content = content.replace(search, replace);
fs.writeFileSync(file, content);
