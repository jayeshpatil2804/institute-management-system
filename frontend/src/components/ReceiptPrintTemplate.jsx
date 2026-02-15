import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

const ReceiptPrintTemplate = React.forwardRef(({ receipt }, ref) => {
  const { user } = useSelector((state) => state.auth);
  const { batches } = useSelector((state) => state.master);
  
  if (!receipt) return null;

  // Convert number to words (Indian style)
  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '');
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '');
    if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '');
    return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + numberToWords(num % 10000000) : '');
  };

  const amountInWords = numberToWords(Math.floor(receipt.amountPaid)) + ' Only';

  const getBatchTime = () => {
      if (!receipt.student?.batch || !batches) return receipt.student?.batch || 'N/A';
      const batchObj = batches.find(b => b.name === receipt.student.batch);
      return batchObj ? `${batchObj.startTime} To ${batchObj.endTime}` : receipt.student.batch;
  };

  // Single Receipt Component
  const SingleReceipt = () => (
    <div style={{ 
      width: '100%',
      height: '48vh', // Approx half page
      border: '0px solid #ddd', // Removed border to match clean look, or keep minimal
      padding: '20px',
      fontFamily: '"Calibri", "Arial", sans-serif',
      fontSize: '11px',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             {/* Left Logo (Placeholder or same logo duplicated if needed, image shows 2) */}
             <img 
              src="/src/assets/logo2.png" 
              alt="Logo"
              style={{ width: '180px', height: 'auto', objectFit: 'contain' }}
            />
        </div>

        {/* Branch Info Section */}
        <div style={{ textAlign: 'right', flex: 1, paddingLeft: '20px' }}>
          <h2 style={{ 
            margin: '0 0 5px 0', 
            // color: '#0070c0', // Blue from image
            color: '#0066cc',
            fontSize: '24px', 
            fontWeight: 'bold' 
          }}>
            {receipt.student?.branchId?.name || receipt.student?.branchName || 'Main Branch'}
          </h2>
          <p style={{ margin: '2px 0', fontSize: '11px', color: '#444', fontWeight: '500' }}>
            {receipt.student?.branchId?.address || '309-A, 309-B, 3rd Floor, Sai Square Building'}<br/>
            {receipt.student?.branchId?.city || 'Bhestan'}, {receipt.student?.branchId?.state || 'Gujarat'} - {receipt.student?.branchId?.pincode || '395023'} (INDIA)
          </p>
          <div style={{ marginTop: '4px', fontSize: '11px', fontWeight: '500' }}>
            <span style={{ color: '#0066cc' }}>Ph. No. : </span> 
            {receipt.student?.branchId?.phone || '9601749300'}, 
            <span style={{ color: '#0066cc', marginLeft: '5px' }}>Mob. No. : </span> 
            {receipt.student?.branchId?.mobile || '9898830409'}
          </div>
          <div style={{ fontSize: '11px', marginTop: '2px', fontWeight: '500' }}>
             <span style={{ color: '#0066cc' }}>Email ID : </span> 
             <a href={`mailto:${receipt.student?.branchId?.email}`} style={{ color: '#0066cc', textDecoration: 'none' }}>
                {receipt.student?.branchId?.email || 'smartinstitutes@gmail.com'}
             </a>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div style={{ borderTop: '1px solid #dcdcdc', marginBottom: '10px' }}></div>

      {/* Title Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5px' }}>
           {/* Spacer to center the title */}
           <div style={{ width: '150px' }}></div>
           
           <h3 style={{ 
               margin: '0', 
               color: '#0066cc', 
               fontSize: '20px', 
               fontWeight: 'normal',
               textAlign: 'center',
               letterSpacing: '1px'
           }}>
               RECEIPT
           </h3>

           <div style={{ textAlign: 'right', fontSize: '11px', width: '150px' }}>
               <div style={{ marginBottom: '2px' }}>
                   <span style={{ color: '#0066cc' }}>Receipt No. : </span> 
                   <span style={{ fontWeight: 'bold' }}>{receipt.receiptNo}</span>
               </div>
               <div>
                   <span style={{ color: '#0066cc' }}>Receipt Date : </span>
                   <span>{moment(receipt.date).format('DD-MMMM-YYYY')}</span>
               </div>
           </div>
      </div>

      {/* Main Table */}
      <div style={{ width: '100%', marginBottom: '5px' }}>
          {/* Table Header */}
          <div style={{ 
              display: 'flex', 
              backgroundColor: '#2e75b6', // Darker Blue
              color: 'white',
              fontWeight: 'bold',
              padding: '6px 10px',
              border: '1px solid #2e75b6'
          }}>
              <div style={{ flex: 1, borderRight: '1px solid white' }}>PARTICULAR</div>
              <div style={{ width: '120px', textAlign: 'center' }}>AMOUNT</div>
          </div>

          {/* Table Body */}
          <div style={{ display: 'flex', border: '1px solid #ddd', borderTop: 'none', backgroundColor: '#e9e9e9' }}>
               {/* Particulars Column */}
               <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #fff' }}>
                    <div style={{ marginBottom: '6px' }}>
                        <span style={{ color: '#0066cc' }}>Received From : </span> 
                        <span style={{ textTransform: 'uppercase' }}>{receipt.student?.firstName} {receipt.student?.lastName}</span>
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                        <span style={{ color: '#0066cc' }}>Course : </span> 
                        <span style={{ textTransform: 'uppercase' }}>
                            {receipt.course?.name || 'N/A'} 
                            {receipt.student?.course?.shortName ? ` (${receipt.student.course.shortName})` : ''}
                        </span>
                    </div>
                     <div style={{ marginBottom: '6px' }}>
                        <span style={{ color: '#0066cc' }}>Remarks : </span> 
                        <span>{receipt.remarks || ''}</span>
                    </div>
                    
                    <div style={{ marginTop: '15px' }}>
                         <span style={{ color: '#0066cc' }}>RUPEES IN WORDS : </span>
                         <span style={{ textTransform: 'uppercase' }}>{amountInWords}</span>
                    </div>
               </div>

               {/* Amount Column */}
               <div style={{ 
                   width: '120px', 
                   display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center', 
                   fontSize: '16px', 
                   fontWeight: 'bold',
                   backgroundColor: '#d0d0d0' // Slightly darker grey for amount cell? Check image. 
                   // Image has simplified shading. Using plain background for now.
               }}>
                   {receipt.amountPaid.toFixed(2)}
               </div>
          </div>
      </div>

      {/* Stats Row (Total, Due, Monthly) */}
      <div style={{ 
          display: 'flex', 
          backgroundColor: '#f2f2f2', 
          padding: '6px 10px', 
          fontSize: '10px',
          marginBottom: '5px',
          border: '1px solid #ddd',
          borderTop: 'none'
      }}>
          <div style={{ flex: 1 }}>
              <span style={{ color: '#0066cc' }}>TOTAL FEES : </span> 
              <span>{receipt.student?.totalFees?.toLocaleString('en-IN')}.00</span>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ color: '#0066cc' }}>DUE FEES : </span> 
              <span>{receipt.student?.pendingFees?.toLocaleString('en-IN')}.00</span>
          </div>
           <div style={{ flex: 1, textAlign: 'right' }}>
              <span style={{ color: '#0066cc' }}>MONTHLY FEES : </span> 
              <span>{receipt.student?.emiDetails?.monthlyInstallment?.toLocaleString('en-IN')}.00</span>
          </div>
      </div>

      {/* Bottom Details */}
      <div style={{ display: 'flex', marginBottom: '40px' }}>
           <div style={{ width: '60%' }}>
                <div style={{ marginBottom: '5px', padding: '4px 10px', backgroundColor: '#f2f2f2' }}>
                     <span style={{ color: '#0066cc' }}>THROUGH : </span> 
                     <span>{receipt.paymentMode}</span>
                </div>
                 <div style={{ padding: '4px 10px', backgroundColor: '#f2f2f2' }}>
                     <span style={{ color: '#0066cc' }}>BATCH TIME : </span> 
                     <span>{getBatchTime()}</span>
                </div>
                
                <div style={{ padding: '10px', marginTop: '10px' }}>
                    <span style={{ color: '#0066cc', fontWeight: 'bold' }}>FEES WILL BE NOT REFUNDABLE</span>
                </div>
           </div>
           
           <div style={{ flex: 1, position: 'relative' }}>
                {/* Signature Area */}
                <div style={{ position: 'absolute', bottom: '20px', right: '10px', textAlign: 'right' }}>
                     <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>
                         {user?.username || 'Admin'}
                     </div>
                     <div style={{ color: '#0066cc', fontSize: '9px', borderTop: '1px solid #ccc', paddingTop: '2px' }}>
                         PREPARED BY
                     </div>
                </div>
           </div>
      </div>

      {/* Copyright Footer */}
      <div style={{ 
          position: 'absolute', 
          bottom: '0', 
          left: '0', 
          width: '100%', 
          backgroundColor: '#f2f2f2', 
          borderTop: '1px solid #ddd',
          padding: '4px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '9px',
          color: '#0066cc'
      }}>
          <div>Website :: www.smartinstituteonline.com</div>
          <div>Copyright © 2010 Smart Institute. All Rights reserved</div>
      </div>

    </div>
  );

  return (
    <div ref={ref} className="print-only">
      <style>
        {`
          @media print {
            @page {
              margin: 0;
              size: A4 portrait;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .print-only {
              display: block !important;
            }
            .no-print {
              display: none !important;
            }
          }
          @media screen {
            .print-only {
              display: none;
            }
          }
        `}
      </style>
      
      <div style={{ 
        width: '210mm',
        height: '297mm',
        margin: '0',
        padding: '0',
        backgroundColor: 'white'
      }}>
        {/* First Copy */}
        <SingleReceipt />
        
        {/* Dotted Line Separator */}
        <div style={{ 
          borderTop: '2px dashed #999',
          margin: '0',
          height: '0'
        }}></div>
        
        {/* Second Copy */}
        <SingleReceipt />
      </div>
    </div>
  );
});

ReceiptPrintTemplate.displayName = 'ReceiptPrintTemplate';

export default ReceiptPrintTemplate;
