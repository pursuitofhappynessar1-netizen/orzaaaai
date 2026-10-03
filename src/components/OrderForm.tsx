import { useState } from 'react';
import { OrderFormData, governorates } from '../types/form';
import styles from './OrderForm.module.css';

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  isSubmitting: boolean;
}

export default function OrderForm({ onSubmit, isSubmitting }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    governorate: '',
    area: '',
    address: '',
    auraQuantity: 0,
    harmoniaQuantity: 0,
    sophiaQuantity: 0,
    kairoQuantity: 0,
    aureliaQuantity: 0,
    soleaQuantity: 0,
  });

  const [errors, setErrors] = useState<Partial<OrderFormData>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'governorate' ? { area: '' } : {}),
    }));
    if (errors[name as keyof OrderFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const getQuantities = (): { aura: number; harmonia: number; sophia: number; kairo: number; aurelia: number; solea: number } => {
    const readVal = (id: string) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      return el ? parseInt(el.value) || 0 : 0;
    };
    return {
      aura: readVal('auraQty'),
      harmonia: readVal('harmoniaQty'),
      sophia: readVal('sophiaQty'),
      kairo: readVal('kairoQty'),
      aurelia: readVal('aureliaQty'),
      solea: readVal('soleaQty'),
    };
  };

  const validate = (): boolean => {
    const newErrors: Partial<OrderFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.governorate) newErrors.governorate = 'المحافظة مطلوبة';
    if (!formData.area) newErrors.area = 'المنطقة مطلوبة';
    if (!formData.address.trim()) newErrors.address = 'العنوان مطلوب';

    const qty = getQuantities();
    const totalItems = qty.aura + qty.harmonia + qty.sophia + qty.kairo + qty.aurelia + qty.solea;
    if (totalItems === 0) {
      newErrors.address = 'اختر كمية من منتج واحد على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const qty = getQuantities();

      const finalFormData: OrderFormData = {
        ...formData,
        auraQuantity: qty.aura,
        harmoniaQuantity: qty.harmonia,
        sophiaQuantity: qty.sophia,
        kairoQuantity: qty.kairo,
        aureliaQuantity: qty.aurelia,
        soleaQuantity: qty.solea,
      };

      onSubmit(finalFormData);
    }
  };

  const areas = formData.governorate
    ? governorates[formData.governorate as keyof typeof governorates]
    : [];

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          الاسم <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
          placeholder="أدخل اسمك الكامل"
        />
        {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          رقم الهاتف <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={styles.input}
          placeholder="01xxxxxxxxx"
        />
        {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          المحافظة <span className="text-red-500">*</span>
        </label>
        <select
          name="governorate"
          value={formData.governorate}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">اختر المحافظة</option>
          {Object.keys(governorates).map((gov) => (
            <option key={gov} value={gov}>
              {gov}
            </option>
          ))}
        </select>
        {errors.governorate && (
          <p className={styles.errorMessage}>{errors.governorate}</p>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          المنطقة <span className="text-red-500">*</span>
        </label>
        <select
          name="area"
          value={formData.area}
          onChange={handleChange}
          disabled={!formData.governorate}
          className={styles.select}
          style={!formData.governorate ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          <option value="">اختر المنطقة</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
        {errors.area && <p className={styles.errorMessage}>{errors.area}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          العنوان بالتفصيل <span className="text-red-500">*</span>
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className={styles.textarea}
          placeholder="الشارع، رقم المبنى، الدور، معالم قريبة..."
        />
        {errors.address && <p className={styles.errorMessage}>{errors.address}</p>}
      </div>

      <div className={styles.quantitySection}>
        <label className={styles.quantityLabel}>
          الكمية المطلوبة من كل منتج <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={styles.productCard}>
            <img
              src="/aura.jpg"
              alt="إسورة مستقيمة"
              className={styles.productImage}
            />
            <p className={styles.productName}>Aura</p>
            <div className="flex items-center justify-center gap-2">
              <label htmlFor="auraQty" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
                الكمية:
              </label>
              <input
                id="auraQty"
                name="auraQty"
                type="number"
                min="0"
                max="10"
                defaultValue="0"
                className={styles.quantityInput}
              />
            </div>
          </div>

          <div className={styles.productCard}>
            <img
              src="/harmonia.jpg"
              alt="إسورة منحنية"
              className={styles.productImage}
            />
            <p className={styles.productName}>Harmonia</p>
            <div className="flex items-center justify-center gap-2">
              <label htmlFor="harmoniaQty" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
                الكمية:
              </label>
              <input
                id="harmoniaQty"
                name="harmoniaQty"
                type="number"
                min="0"
                max="10"
                defaultValue="0"
                className={styles.quantityInput}
              />
            </div>
          </div>

          <div className={styles.productCard}>
            <img
              src="/sophia.jpg"
              alt="إسورة منحنية ذهبي"
              className={styles.productImage}
            />
            <p className={styles.productName}>Sophia</p>
            <p className={styles.productLabel}>حصري للنساء</p>
            <div className="flex items-center justify-center gap-2">
              <label htmlFor="sophiaQty" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
                الكمية:
              </label>
              <input
                id="sophiaQty"
                name="sophiaQty"
                type="number"
                min="0"
                max="10"
                defaultValue="0"
                className={styles.quantityInput}
              />
            </div>
          </div>

          <div className={styles.productCard}>
            <img
              src="/kairo.jpg"
              alt="إسورة كايرو"
              className={styles.productImage}
            />
            <p className={styles.productName}>Kaïro</p>
            <div className="flex items-center justify-center gap-2">
              <label htmlFor="kairoQty" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
                الكمية:
              </label>
              <input
                id="kairoQty"
                name="kairoQty"
                type="number"
                min="0"
                max="10"
                defaultValue="0"
                className={styles.quantityInput}
              />
            </div>
          </div>

          <div className={styles.productCard}>
            <img
              src="/aurelia.jpg"
              alt="إسورة أوريليا"
              className={styles.productImage}
            />
            <p className={styles.productName}>Aurelia</p>
            <div className="flex items-center justify-center gap-2">
              <label htmlFor="aureliaQty" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
                الكمية:
              </label>
              <input
                id="aureliaQty"
                name="aureliaQty"
                type="number"
                min="0"
                max="10"
                defaultValue="0"
                className={styles.quantityInput}
              />
            </div>
          </div>

          <div className={styles.productCard}>
            <img
              src="/solea.jpg"
              alt="إسورة سوليا"
              className={styles.productImage}
            />
            <p className={styles.productName}>Soléa</p>
            <div className="flex items-center justify-center gap-2">
              <label htmlFor="soleaQty" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
                الكمية:
              </label>
              <input
                id="soleaQty"
                name="soleaQty"
                type="number"
                min="0"
                max="10"
                defaultValue="0"
                className={styles.quantityInput}
              />
            </div>
          </div>
        </div>
        {errors.address && errors.address.includes('منتج') && (
          <p className={styles.errorMessage}>{errors.address}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
      </button>
    </form>
  );
}
