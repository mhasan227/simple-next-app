import { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import { useSelector } from 'react-redux';

export default function Modal({ isOpen, onClose, onDataAdded }) {

    const [rows, setRows] = useState([{ line_item_name: "", store: "", runners_name: "", amount: "", card_number: "", transaction_date: "" }]);
    const token           = useSelector((state) => state.auth.token);
    // Handle input change
    const handleChange = (index, e) => {
        console.log(e.target);
        const { name, value } = e.target;
        
        const newRows = [...rows];

        if (name === 'card_number') {
            // Only update if the value length is 5 
            if (value.length > 5) return;
            newRows[index][name] = value ? Number(value) : "";
        } 
        else if (name === 'amount') {
            newRows[index][name] = value ? Number(value) : "";
        }
        else {
            newRows[index][name] = value;
        }
        setRows(newRows);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        let isValid = true;
        for (const row of rows) {
            if (!row.line_item_name || !row.store || !row.runners_name || !row.card_number || !row.amount || !row.transaction_date) {
                isValid = false;
                break;
            }
            console.log("cl",row.card_number)
            // Check if card_number has exactly 5 digits
            if (String(row.card_number).length !== 5) {
                alert(`Card number must be exactly 5 digits for item: ${row.line_item_name}`);
                isValid = false;
                break;
            }

        }
        
        if (!isValid) {
            alert('Please fill out all required fields.');
            return;
        }

        // Map through rows to format the transaction_date
        const finalData = rows.map(row => ({
            ...row,
            transaction_date: formatDate(row.transaction_date)
        }));

        console.log(finalData); 
        if (!token) return;
        try {
            
            const response = await fetch('https://devapi.propsoft.ai/api/auth/interview/material-purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ material_purchase: finalData })
            });
    
            const result = await response.json();
    
            if (response.ok) {
                onDataAdded();
                alert('Material purchase submitted successfully!');
                setRows([{ line_item_name: "", store: "", runners_name: "", amount: "", card_number: "", transaction_date: "" }]);
                onClose(); 
            } else {
                console.error('Error:', result);
                alert(`Failed to submit: ${result.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Failed to submit: ${error.message}`);
        }

    };

    // Add a new row of input fields
    const addRow = () => {
        setRows([...rows, { line_item_name: "", store: "", runners_name: "", amount: "", card_number: "", transaction_date: "" }]);
    };
    

    const modalRef = useRef(null);

    const removeRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    // Close modal on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    function formatDate(date) {
        if (!date) return '';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const [month, day, year] = new Date(date).toLocaleDateString('en-US', options).split('/');
        return `${month}-${day}-${year}`;
    }

    if (!isOpen) return null; // Return null if modal is not open

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div ref={modalRef} className="bg-white rounded-lg w-[90%] sm:w-[840px] shadow-lg">
            <div className='flex h-16 items-center justify-center rounded' style={{backgroundColor: '#2563EB'}}>
                <span className="text-xl font-[inter] font-semibold text-white mb-0 text-center">Material Purchase</span>
            </div>
          
           <form className='p-4 overflow-auto' style={{ maxHeight: '400px' }} onSubmit={handleSubmit}>
                    <table className="min-w-full table-auto text-xs text-left">
                        <thead className="" style={{background: '#E5E7EB', color: '#545454'}}>
                            <tr>
                                <th className="px-4 py-3 border border-gray-300">ITEMS*</th>
                                <th className="px-4 py-3 border border-gray-300">STORE*</th>
                                <th className="px-4 py-3 border border-gray-300">Runner's Name*</th>
                                <th className="px-4 py-3 border border-gray-300">AMOUNT*</th>
                                <th className="px-4 py-3 border border-gray-300">CARD NO.*</th>
                                <th className="px-4 py-3 border border-gray-300">TRANSACTION DATE*</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 border border-gray-300">
                                        <input
                                            maxLength={200} 
                                            type="text"
                                            name="line_item_name"
                                            value={row.line_item_name}
                                            onChange={(e) => handleChange(index, e)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300">
                                        <input
                                            maxLength={200}
                                            type="text"
                                            name="store"
                                            value={row.store}
                                            onChange={(e) => handleChange(index, e)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300">
                                        <input
                                            maxLength={200}
                                            type="text"
                                            name="runners_name"
                                            value={row.runners_name}
                                            onChange={(e) => handleChange(index, e)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                                        />
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300">
                                        <div className='flex flex-row items-center gap-1'>
                                            <span>$</span>
                                            <input
                                                type="number"
                                                name="amount"
                                                value={row.amount}
                                                onChange={(e) => handleChange(index, e)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300 border-r-0">
                                        <input
                                            type="number"
                                            name="card_number"
                                            value={row.card_number}
                                            onChange={(e) => handleChange(index, e)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                                            maxLength={5} // Prevent user from typing more than 5 digits
                                        />
                                    </td>
                                    <td className="px-2 py-2 border border-gray-300 border-r-0">
                                        <input 
                                            type="date"
                                            name="transaction_date"
                                            value={row.transaction_date}
                                            onChange={(e) => handleChange(index, e)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-center border-0">
                                        <button
                                            type="button"
                                            onClick={() => removeRow(index)}
                                            className="text-red-600 hover:text-red-800 flex items-center justify-center"
                                            style={{width: '28px'}}
                                        >
                                            <Image src='/assets/trash.svg' width={24} height={24} alt="Delete" className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Add Row Button */}
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 mr-10 bg-blue-600 text-white hover:bg-blue-700 rounded-full"
                            onClick={addRow}
                        >
                            +
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 mr-8 flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
            </form>
            {/* footer color */}
            <div className='flex h-6 items-center justify-center rounded' style={{backgroundColor: '#2563EB'}}/>
        </div>
      </div>
    );
  }
  