import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveQuotation, getQuotations, deleteQuotation } from '../services/quotationService';

const ProjectQuotation = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    email: '',
    phone: '',
    projectTitle: '', 
    projectType: 'Web Development',
    currency: '₹'
  });

  const [scopeItems, setScopeItems] = useState([
    { description: 'Website Design & Development', duration: 'Lifetime', unitPrice: 29999, total: 29999 },
    { description: 'Domain (.org.in / .ac.in)', duration: 'Per Year', unitPrice: 2999, total: 2999 },
    { description: 'Hosting', duration: 'Per Year', unitPrice: 999, total: 999 },
    { description: 'SSL Certificate (Secure)', duration: 'Per Year', unitPrice: 999, total: 999 },
    { description: 'Search Engine Optimization (SEO)', duration: 'Free for Lifetime', unitPrice: 0, total: 0 },
    { description: 'Support & Maintenance', duration: 'Free for 3 Months', unitPrice: 0, total: 0 },
  ]);

  const [savedQuotations, setSavedQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    loadSavedQuotations();
  }, []);

  const loadSavedQuotations = async () => {
    try {
      const quotations = await getQuotations();
      setSavedQuotations(quotations);
    } catch (error) {
      console.error('Error loading quotations:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScopeChange = (index, field, value) => {
    const newScopeItems = [...scopeItems];
    
    if (field === 'unitPrice' || field === 'total') {
        newScopeItems[index][field] = parseFloat(value) || 0;
    } else {
        newScopeItems[index][field] = value;
    }

    if (field === 'unitPrice') {
        newScopeItems[index].total = newScopeItems[index].unitPrice;
    }
    
    setScopeItems(newScopeItems);
  };

  const addScopeItem = () => {
    setScopeItems([...scopeItems, { description: '', duration: '', unitPrice: 0, total: 0 }]);
  };

  const removeScopeItem = (index) => {
    const newScopeItems = scopeItems.filter((_, i) => i !== index);
    setScopeItems(newScopeItems);
  };

  const calculateTotal = () => {
    return scopeItems.reduce((acc, item) => acc + (item.total || 0), 0);
  };

  // --- PDF GENERATION LOGIC ---
  const generatePDF = async (savedData = null, mode = 'download') => {
    // Determine which data to use: passed savedData (if click from list) or current form state
    const isSaved = savedData && savedData.clientName;
    const currentData = isSaved ? savedData : formData;
    const currentScopeItems = isSaved ? (savedData.scopeItems || []) : scopeItems;
    // Calculate total on the fly or use saved if preferred. Recalculating is safer for consistency.
    const currentTotal = currentScopeItems.reduce((acc, item) => acc + (item.total || 0), 0);

    const doc = new jsPDF();
    
    let pdfCurrency = 'Rs.';
    let fontName = 'helvetica'; // Default font

    // 1. Try to Load Custom Font (Roboto) for Rupee Symbol Support
    try {
        const fontUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf';
        const response = await fetch(fontUrl);
        if (response.ok) {
            const blob = await response.blob();
            const fontBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(blob);
            });
            
            doc.addFileToVFS('Roboto-Regular.ttf', fontBase64);
            doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
            doc.setFont('Roboto');
            
            pdfCurrency = currentData.currency; 
            fontName = 'Roboto';
        } else {
            console.warn("Could not fetch font, falling back to standard.");
            pdfCurrency = currentData.currency === '₹' ? 'Rs.' : currentData.currency;
        }
    } catch (error) {
        console.warn("Font loading failed", error);
        pdfCurrency = currentData.currency === '₹' ? 'Rs.' : currentData.currency;
    }

    // Helper to draw gradient text character by character
    const drawGradientText = (text, x, y, startRGB, endRGB) => {
        let currentX = x;
        const totalChars = text.length;
        
        for (let i = 0; i < totalChars; i++) {
            const char = text[i];
            const ratio = i / (totalChars - 1);
            
            const r = Math.round(startRGB[0] + (endRGB[0] - startRGB[0]) * ratio);
            const g = Math.round(startRGB[1] + (endRGB[1] - startRGB[1]) * ratio);
            const b = Math.round(startRGB[2] + (endRGB[2] - startRGB[2]) * ratio);
            
            doc.setTextColor(r, g, b);
            doc.text(char, currentX, y);
            
            currentX += doc.getTextWidth(char);
        }
    };

    // 2. HEADER section
    const logoX = 15;
    const logoY = 10;
    const logoWidth = 35;
    const logoHeight = 35;

    // Try to load logo
    try {
        const logoUrl = '/logo.png'; 
        const response = await fetch(logoUrl);
        if (response.ok) {
            const blob = await response.blob();
            const logoBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
            doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight); 
        }
    } catch (error) {
        console.warn("Logo not found");
    }

    // Company Name (Right of Logo) with Gradient
    doc.setFontSize(26);
    doc.setFont(fontName, "bold"); 
    
    // Gradient: Cyan [0, 198, 255] to Purple [160, 32, 240]
    drawGradientText(
        "APEXSOFT TECHNOLOGY", 
        60, 
        25, 
        [0, 198, 255], 
        [160, 32, 240]
    );

    // Tagline
    doc.setFontSize(10);
    doc.setTextColor(200, 80, 255); // #C850FF (Violet/Purple)
    doc.setFont(fontName, "normal");
    doc.text("TECH THAT ELEVATES YOUR BUSINESS", 60, 32);

    // Divider Line
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(15, 50, 195, 50);

    // 3. INFO section
    const infoY = 65;
    
    // Left: INVOICE / QUOTATION Label
    doc.setFontSize(22);
    doc.setTextColor(100, 120, 255); // Light Indigo/Purple
    doc.setFont(fontName, "bold");
    doc.text("QUOTATION", 15, infoY);

    // Quotation Details
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont(fontName, "normal");
    doc.text(`Quotation No. ${Math.floor(1000 + Math.random() * 9000)}`, 15, infoY + 10);
    doc.text(`${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`, 15, infoY + 16);

    // Right: BILLED TO
    const billedToX = 110;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Black
    doc.setFont(fontName, "bold");
    doc.text("BILLED TO", billedToX, infoY);

    doc.setFont(fontName, "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    // Client Name
    doc.text(currentData.clientName || "Client Name", billedToX, infoY + 6);
    // Phone
    if (currentData.phone) {
      doc.text(`Phone No.: ${currentData.phone}`, billedToX, infoY + 11);
    }
    // Location
    doc.text("Maharashtra, India", billedToX, infoY + 16);

    // 4. TABLE section
    const formatAmount = (amount) => {
        return amount.toLocaleString('en-IN', {
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2
        });
    };

    const tableBody = currentScopeItems.map(item => [
      item.description,
      item.duration,
      `${pdfCurrency} ${formatAmount(item.unitPrice)}`,
      // Add currency signal to TOTAL as requested
      `${pdfCurrency} ${formatAmount(item.total)}`
    ]);

    autoTable(doc, {
      startY: infoY + 30,
      head: [['ITEM', 'DURATION', 'UNIT PRICE', 'TOTAL']],
      body: tableBody,
      theme: 'plain', 
      headStyles: {
        fontStyle: 'bold',
        fontSize: 9,
        textColor: [0, 0, 0], 
        halign: 'left',
        cellPadding: { top: 5, bottom: 5, left: 0, right: 0 } 
      },
      styles: {
        font: fontName, 
        fontSize: 9,
        textColor: [60, 60, 60],
        cellPadding: { top: 5, bottom: 5, left: 0, right: 0 },
        valign: 'middle',
        lineColor: [240, 240, 240],
        lineWidth: { bottom: 0.1 } 
      },
      // Column Specifics
      columnStyles: {
        0: { cellWidth: 70 }, // Item 
        1: { cellWidth: 50 }, // Duration
        2: { cellWidth: 35, halign: 'left' }, // Unit Price - Left Aligned
        3: { cellWidth: 35, halign: 'left' }  // Total - Left Aligned
      },
      tableLineColor: [255, 255, 255], 
      tableLineWidth: 0,
    });

    // 5. TOTAL section
    const finalY = doc.lastAutoTable.finalY + 10;
    
    // Grey box behind Total
    // x=135, y=finalY-5, w=60, h=10
    doc.setFillColor(230, 230, 230); // Light grey
    doc.rect(130, finalY - 6, 65, 12, 'F');

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont(fontName, "bold");
    doc.text("Total :", 155, finalY + 2, { align: "right" });
    
    doc.setFontSize(11);
    doc.setFont(fontName, "normal");
    // Use pdfCurrency and formatAmount here too
    doc.text(`${pdfCurrency} ${formatAmount(currentTotal)}`, 190, finalY + 2, { align: "right" });

    // 6. NOTES section
    let noteY = finalY + 30;
    
    doc.setFontSize(10);
    doc.setFont(fontName, "bold");
    doc.text("NOTE:", 15, noteY);
    
    doc.setFontSize(9);
    doc.setFont(fontName, "normal");
    doc.setTextColor(60, 60, 60);
    const terms = [
        "The following payment terms shall apply to this quotation:",
        "30% advance payment upon quotation approval.",
        "30% payment upon completion of the final demo.",
        "40% payment upon final completion and handover."
    ];
    
    terms.forEach((term, index) => {
        doc.text(term, 15, noteY + 6 + (index * 6));
    });

    // 7. FOOTER section - "THANK YOU!"
    const footerY = noteY + 50; 

    doc.setFontSize(18);
    // Gradient text simulation? Just use a nice pinkish/gold color
    doc.setFont(fontName, "bold");
    
    const thankYouText = "THANK YOU!";
    const w = doc.getTextWidth(thankYouText);
    const tyX = 105 - (w / 2);
    
    drawGradientText(thankYouText, tyX, footerY, [255, 160, 120], [255, 100, 200]);

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont(fontName, "normal");
    doc.text("Reach out to Apexsoft.onrender.com or +91 7796457176", 105, footerY + 7, { align: "center" });

    // Save
    if (mode === 'view') {
        window.open(doc.output('bloburl'), '_blank');
    } else {
        doc.save(`${currentData.clientName.replace(/\s+/g, '_') || 'Quotation'}.pdf`);
        
        setMessage('PDF generated successfully!');
        setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const quotationData = {
        ...formData,
        scopeItems,
        totalAmount: calculateTotal(),
      };
      
      await saveQuotation(quotationData);
      
      await loadSavedQuotations();
      setShowSaved(true);
      setMessage('Quotation saved successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage('Error saving quotation.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (quotation) => {
    generatePDF(quotation, 'view');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteQuotation(id);
        loadSavedQuotations();
        setMessage('Deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          {/* Decorative Gradient Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
              Project Quotation
            </h1>
            <p className="text-gray-500 font-medium">Create professional quotations with ApexSoft styles</p>
          </div>
          
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="group px-6 py-3 bg-white text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 shadow-sm transition-all duration-300 font-semibold flex items-center gap-2 z-10"
          >
            {showSaved ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Create New
              </>
            ) : (
             <>
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
               View Saved List
             </>
            )}
          </button>
        </div>

        {showSaved ? (
          // Saved List
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-xl text-gray-800">Saved Quotations</h2>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">{savedQuotations.length} records</span>
            </div>
            
            {savedQuotations.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-gray-900 font-medium text-lg mb-1">No saved quotations found</h3>
                <p className="text-gray-500">Create a new quotation to get started</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {savedQuotations.map((q) => (
                  <div key={q.id} className="p-6 hover:bg-indigo-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-colors duration-200 group">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-700 transition-colors">{q.clientName || 'Unnamed Client'}</h3>
                          {q.createdAt?.toDate && (
                             <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded border border-gray-200">
                                {q.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                             </span>
                          )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                         {q.companyName && <span className="font-medium text-gray-600">{q.companyName}</span>}
                         {q.companyName && q.phone && <span className="text-gray-300">•</span>}
                         {q.phone && <span>{q.phone}</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right min-w-[100px]">
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">Total Amount</div>
                        <div className="font-bold text-xl text-indigo-600">
                          {q.currency || '₹'} <span className="text-indigo-900">{(q.totalAmount || q.totalCost || 0).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleView(q)}
                            className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all tooltip-trigger"
                            title="View PDF"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                             </svg>
                          </button>
                          <button 
                            onClick={() => generatePDF(q)}
                            className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Download PDF"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                             </svg>
                          </button>
                          <div className="h-6 w-px bg-gray-200 mx-1"></div>
                          <button 
                            onClick={() => handleDelete(q.id)}
                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                             </svg>
                          </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Form
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
            
            {/* Left Col: Client Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-3 text-lg">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-indigo-700 rounded-full"></span>
                  Client Details
                </h3>
                
                <div className="space-y-5">
                  <div className="group">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5 ml-1">Client Name <span className="text-red-400">*</span></label>
                    <input name="clientName" value={formData.clientName} onChange={handleInputChange} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200" placeholder="e.g. Acme Corp" />
                  </div>
                  <div className="group">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5 ml-1">Company Name</label>
                    <input name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200" placeholder="Optional" />
                  </div>
                  <div className="group">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5 ml-1">Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200" placeholder="Optional" />
                  </div>
                  <div className="group">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5 ml-1">Currency</label>
                    <div className="relative">
                        <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition-all duration-200 cursor-pointer">
                          <option value="₹">INR (₹)</option>
                          <option value="$">USD ($)</option>
                          <option value="€">EUR (€)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

               <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group">
                  {/* Background Accents */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none transition-transform duration-700 group-hover:scale-125"></div>

                  <div className="relative z-10">
                      <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">Estimated Total</div>
                      <div className="text-4xl font-extrabold tracking-tight mb-1">{formData.currency} {calculateTotal().toLocaleString()}</div>
                      <p className="text-xs text-indigo-300/80">Calculated based on items added</p>
                      
                      <div className="mt-8 space-y-3">
                        <button type="button" onClick={generatePDF} className="w-full py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20 flex justify-center items-center gap-2 group-hover:border-white/30">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                           Download PDF
                        </button>
                        <button type="submit" disabled={loading} className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg shadow-indigo-900/20 flex justify-center items-center gap-2">
                           {loading ? (
                             <span className="flex items-center gap-2">
                               <svg className="animate-spin h-4 w-4 text-indigo-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                               Saving...
                             </span>
                           ) : (
                             'Save Quotation'
                           )}
                        </button>
                      </div>
                  </div>
               </div>
            </div>

            {/* Right Col: Items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 h-full">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 flex items-center gap-3 text-lg">
                      <span className="w-1.5 h-6 bg-pink-500 rounded-full"></span>
                      Quotation Items
                    </h3>
                    <button type="button" onClick={addScopeItem} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                       Add Item
                    </button>
                 </div>

                 <div className="space-y-4">
                    {/* Header Row for Desktop */}
                    <div className="hidden md:flex gap-4 px-4 py-2 bg-gray-50 rounded-lg text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <div className="flex-grow">Item Description</div>
                        <div className="w-32">Duration</div>
                        <div className="w-32 text-right">Unit Price</div>
                        <div className="w-32 text-right">Total</div>
                        <div className="w-8"></div>
                    </div>

                    {scopeItems.map((item, index) => (
                      <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:shadow-md hover:border-indigo-200 group">
                         <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                             
                             {/* Description */}
                             <div className="flex-grow w-full">
                                <label className="md:hidden text-xs text-gray-500 font-medium px-1 mb-1 block">Item Description</label>
                                <input
                                   value={item.description}
                                   onChange={(e) => handleScopeChange(index, 'description', e.target.value)}
                                   className="w-full bg-transparent border-0 border-b border-gray-200 px-0 py-2 text-sm focus:ring-0 focus:border-indigo-500 placeholder-gray-300 font-medium text-gray-700 transition-colors"
                                   placeholder="Service or Product Description"
                                />
                             </div>

                             {/* Duration */}
                             <div className="w-full md:w-32">
                                <label className="md:hidden text-xs text-gray-500 font-medium px-1 mb-1 block">Duration</label>
                                <input
                                   value={item.duration}
                                   onChange={(e) => handleScopeChange(index, 'duration', e.target.value)}
                                   className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                   placeholder="Duration"
                                />
                             </div>

                             {/* Unit Price */}
                             <div className="w-full md:w-32">
                                <label className="md:hidden text-xs text-gray-500 font-medium px-1 mb-1 block">Unit Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">{formData.currency}</span>
                                    <input
                                       type="number"
                                       value={item.unitPrice}
                                       onChange={(e) => handleScopeChange(index, 'unitPrice', e.target.value)}
                                       className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-right transition-all"
                                    />
                                </div>
                             </div>

                             {/* Total */}
                             <div className="w-full md:w-32">
                                <label className="md:hidden text-xs text-gray-500 font-medium px-1 mb-1 block">Total</label>
                                <div className="bg-gray-100 rounded-lg px-3 py-2 text-right font-bold text-gray-700 text-sm border border-transparent">
                                   {/* Manual calc for display if needed, but usually item.total is updated via state */}
                                   {item.total ? item.total.toLocaleString() : '0'}
                                </div>
                             </div>

                             {/* Delete */}
                             <div className="flex justify-end w-full md:w-auto pt-2 md:pt-0">
                                <button type="button" onClick={() => removeScopeItem(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                             </div>
                         </div>
                      </div>
                    ))}
                    
                    <button 
                        type="button" 
                        onClick={addScopeItem}
                        className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all font-medium flex justify-center items-center gap-2 group mt-2"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                        </div>
                        Add New Item Row
                    </button>
                 </div>
              </div>
              
              {message && (
                <div className={`mt-4 p-4 rounded-lg font-medium text-center ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {message}
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProjectQuotation;
