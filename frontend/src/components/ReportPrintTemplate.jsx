import React from 'react';
import moment from 'moment';

const ReportPrintTemplate = React.forwardRef(({ receipts, totalAmount, filters }, ref) => {
  if (!receipts || receipts.length === 0) return null;

  return (
    <div ref={ref} className="print-only" style={{ padding: '0', margin: '0' }}>
      <style>
        {`
          @media print {
            @page {
              margin: 0;
              size: A4 landscape;
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
        fontFamily: 'Arial, sans-serif', 
        padding: '30px', 
        backgroundColor: 'white',
        color: '#000'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            margin: '0 0 10px 0',
            textTransform: 'uppercase'
          }}>
            Student Fees Receipt Report
          </h1>
          <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
            Education ERP Institute
          </p>
          {filters && (
            <div style={{ marginTop: '15px', fontSize: '12px', color: '#555' }}>
              {filters.startDate && filters.endDate && (
                <p style={{ margin: '3px 0' }}>
                  <strong>Period:</strong> {moment(filters.startDate).format('DD/MM/YYYY')} to {moment(filters.endDate).format('DD/MM/YYYY')}
                </p>
              )}
              {filters.studentName && (
                <p style={{ margin: '3px 0' }}>
                  <strong>Student:</strong> {filters.studentName}
                </p>
              )}
              {filters.receiptType && (
                <p style={{ margin: '3px 0' }}>
                  <strong>Payment Mode:</strong> {filters.receiptType}
                </p>
              )}
              <p style={{ margin: '3px 0' }}>
                <strong>Generated On:</strong> {moment().format('DD/MM/YYYY HH:mm')}
              </p>
            </div>
          )}
        </div>

        {/* Report Table */}
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '12px',
          marginBottom: '20px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #000' }}>
              <th style={{ padding: '10px', textAlign: 'center', borderRight: '1px solid #ddd' }}>
                S. No.
              </th>
              <th style={{ padding: '10px', textAlign: 'left', borderRight: '1px solid #ddd' }}>
                Receipt Date
              </th>
              <th style={{ padding: '10px', textAlign: 'left', borderRight: '1px solid #ddd' }}>
                Receipt No
              </th>
              <th style={{ padding: '10px', textAlign: 'left', borderRight: '1px solid #ddd' }}>
                Payment Mode
              </th>
              <th style={{ padding: '10px', textAlign: 'left', borderRight: '1px solid #ddd' }}>
                Student
              </th>
              <th style={{ padding: '10px', textAlign: 'left', borderRight: '1px solid #ddd' }}>
                Course Name
              </th>
              <th style={{ padding: '10px', textAlign: 'right' }}>
                Amount (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt, index) => (
              <tr key={receipt._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'center',
                  borderRight: '1px solid #ddd'
                }}>
                  {index + 1}
                </td>
                <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>
                  {moment(receipt.date).format('DD/MM/YYYY')}
                </td>
                <td style={{ 
                  padding: '8px', 
                  fontFamily: 'monospace',
                  borderRight: '1px solid #ddd'
                }}>
                  {receipt.receiptNo}
                </td>
                <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>
                  {receipt.paymentMode}
                </td>
                <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>
                  {receipt.student?.firstName} {receipt.student?.lastName}
                </td>
                <td style={{ padding: '8px', borderRight: '1px solid #ddd' }}>
                  {receipt.course?.name || 'N/A'}
                </td>
                <td style={{ 
                  padding: '8px', 
                  textAlign: 'right',
                  fontFamily: 'monospace',
                  fontWeight: '500'
                }}>
                  {receipt.amountPaid.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
            
            {/* Total Row */}
            <tr style={{ 
              backgroundColor: '#f9f9f9', 
              borderTop: '2px solid #000',
              fontWeight: 'bold'
            }}>
              <td colSpan="6" style={{ 
                padding: '12px', 
                textAlign: 'right',
                fontSize: '14px'
              }}>
                Total Amount:
              </td>
              <td style={{ 
                padding: '12px', 
                textAlign: 'right',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
                ₹ {totalAmount.toLocaleString('en-IN')}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Summary */}
        <div style={{ marginTop: '30px', fontSize: '12px', color: '#555' }}>
          <p style={{ margin: '3px 0' }}>
            <strong>Total Receipts:</strong> {receipts.length}
          </p>
          <p style={{ margin: '3px 0' }}>
            <strong>Total Amount Collected:</strong> ₹ {totalAmount.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '50px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end'
        }}>
          <div style={{ fontSize: '11px', color: '#999' }}>
            This is a computer generated report.
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              height: '50px', 
              width: '150px', 
              borderBottom: '1px solid #999',
              marginBottom: '8px'
            }}></div>
            <p style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              margin: '0'
            }}>
              Authorized Signatory
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

ReportPrintTemplate.displayName = 'ReportPrintTemplate';

export default ReportPrintTemplate;
