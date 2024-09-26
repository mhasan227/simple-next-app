'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'; 
import Image from "next/image";
import Modal from "../components/Modal";
import { logout } from '../../store/slices/authSlice'; 
import withAuth from '../components/withAuth';

function MaterialPurchase() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages]   = useState(1);   
    const [data, setData]               = useState([]);
    const [loading, setLoading]         = useState(false);
    const email                         = useSelector((state) => state.auth.email);
    const token                         = useSelector((state) => state.auth.token);
    const dispatch                      = useDispatch();

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const response = await fetch(`https://devapi.propsoft.ai/api/auth/interview/material-purchase?page=${currentPage}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();

                if (response.ok && result.status_code === '1') {
                    setData(result.material_purchase_list.data);
                    setTotalPages(result.material_purchase_list.last_page);
                } else {
                    console.error(result.status_message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData(); 
    }, [currentPage, token]);

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleLogout = () => {
        dispatch(logout());

        // document.cookie.remove('token');
    
        window.location.href = '/'; 
    };

    return(
       <div>
            {/* Header section */}
            <div className="h-1/6 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.1)] sticky px-8 py-4 z-10 flex justify-between">

                <div className="w-[250px] shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] rounded-2xl bg-whitesmoke-100 flex flex-row items-start justify-start py-2 px-[13px] box-border gap-[15px] z-[1]">

                    <Image
                        className="h-[38px] w-[38px] relative z-[1]"
                        loading="lazy"
                        alt=""
                        width={50}
                        height={50}
                        src="/assets/vector.png"
                    />
                    <div className="flex-1 flex flex-col items-start justify-start pt-2.5 px-0 pb-0">
                        <div className="self-stretch relative leading-[18px] z-[1]">
                            {email}
                        </div>
                    </div>

                </div>

                <button
                    onClick={handleLogout}
                    className="px-6 py-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Logout
                </button> 
                {/* logout for personal testing */}

            </div>

            <div className="mt-16 px-8 sm:w-[100%] md:w-[100%] lg:w-[75%]">

                <div className="flex flex-row justify-between">
                    <h1 className="leading-[18px] font-semibold font-[inter] lg:text-[29px] md:leading-[14px]" style={{color: '#2563EB'}}>
                        Material Purchase
                    </h1>

                    <button
                        onClick     =   {toggleModal}
                        className   =   "px-6 py-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add Material Purchase
                    </button>
                </div>

                {/* Loading Indicator */}
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Image
                            src="/assets/loading.gif"
                            alt="Loading..."
                            width={50}
                            height={50}
                        />
                    </div>
                ):
                (
                    <div className="overflow-x-auto mt-6">
                        <table className="min-w-full table-auto text-xs text-left text-darkslategray" style={{color: '#4b4b4b'}}>
                            <thead className="bg-royalblue-100 text-white" style={{backgroundColor: 'rgba(37, 99, 235, 0.6)'}}>
                                <tr>
                                    <th className="px-6 py-4 capitalize font-semibold border-r-2 border-white">Items</th>
                                    <th className="px-6 py-4 capitalize font-semibold border-r-2 border-white">Store</th>
                                    <th className="px-6 py-4 capitalize font-semibold border-r-2 border-white">Runner's Name</th>
                                    <th className="px-6 py-4 capitalize font-semibold border-r-2 border-white">Amount</th>
                                    <th className="px-6 py-4 capitalize font-semibold border-r-2 border-white">Card No.</th>
                                    <th className="px-6 py-4 capitalize font-semibold">Transaction Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? "bg-customGray" : "bg-customBlue"}
                                    >
                                        <td className="px-6 py-4 font-semibold">{row.line_item_name}</td>
                                        <td className="px-6 py-4 font-semibold">{row.store}</td>
                                        <td className="px-6 py-4 font-semibold">{row.runners_name}</td>
                                        <td className="px-6 py-4 font-semibold">{row.amount}</td>
                                        <td className="px-6 py-4 font-semibold">{row.card_number}</td>
                                        <td className="px-6 py-4 font-semibold">{row.transaction_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="mt-6 mb-12 flex justify-center">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-4 py-2 mx-1 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 mx-1 text-black">{`Page ${currentPage} of ${totalPages}`}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-4 py-2 mx-1 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            

            </div>

            {/* Modal */}
            <Modal
                isOpen      =   {isModalOpen} 
                onClose     =   {toggleModal} 
                onDataAdded =   {() => fetchData(currentPage)}
            />

       </div>
    );
}
export default withAuth(MaterialPurchase);