import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css'; 
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart, Bar } from 'react-chartjs-2'
ChartJS.register(...registerables);

const Dashboard = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState({
      name: 'Social',
      location: 'Hebbal',
      charge_customers: true,
      custom_song_request_amount: 99,
      regular_song_request_amounts: [79, 59, 39, 19],
    });
  
    const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`https://stg.dhunjam.in/account/admin/${userId}`);
        setUserDetails(response.data.data);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };
  
    useEffect(() => {
      fetchUserDetails();
    }, [userId]);
  
    const handleCustomAmountChange = (value) => {
      setUserDetails((prevDetails) => ({ ...prevDetails, custom_song_request_amount: value }));
      setIsSaveButtonEnabled(value > 99);
    };
  
    const handleRegularAmountChange = (index, value) => {
      const newRegularAmounts = [...userDetails.regular_song_request_amounts];
      newRegularAmounts[index] = value;
      setUserDetails((prevDetails) => ({ ...prevDetails, regular_song_request_amounts: newRegularAmounts }));
      setIsSaveButtonEnabled(newRegularAmounts.every((amount, i) => amount > [79, 59, 39, 19][i]));
    };
  
    const handleSave = async () => {
      try {
        await axios.put(`https://stg.dhunjam.in/account/admin/${userId}`, {
          amount: {
            category_6: userDetails.regular_song_request_amounts[0],
            category_7: userDetails.regular_song_request_amounts[1],
            category_8: userDetails.regular_song_request_amounts[2],
            category_9: userDetails.regular_song_request_amounts[3],
            category_10: userDetails.regular_song_request_amounts[4],
          },
        });
  
        await fetchUserDetails();
      } catch (error) {
        console.error('Error updating prices:', error.message);
      }
    };
  
    const chartData = {
      labels: ['Custom', 'Category 1', 'Category 2', 'Category 3', 'Category 4'],
      datasets: [
        {
          color:"#F0CF1",
          data: [userDetails.custom_song_request_amount, ...userDetails.regular_song_request_amounts],
          backgroundColor: [
            '#F0C3F1', 
            '#F0C3F1', 
            '#F0C3F1', 
            '#F0C3F1', 
            '#F0C3F1', 
          ],
          borderColor: [
            '#FFFFFF',
            '#FFFFFF',
            '#FFFFFF',
            '#FFFFFF',
            '#FFFFFF',
          ],
          borderWidth: 1,
        },
      ],
    };
  
    const chartOptions = {
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            borderColor: 'white'
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            display: false
          }
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  
    return (
      <div className="dashboard-container">
        <h1>{userDetails.name}, {userDetails.location} on Dhun Jam</h1>
  
        <div className="question-container">
          <div className="question-set1">
            <p>Do you want to charge your<br />customers for requesting songs?</p>
            <div id='radio-text'>
              <input
                type="radio"
                id="yes"
                name="chargeCustomers"
                checked={userDetails.charge_customers}
                onChange={() => setUserDetails({ ...userDetails, charge_customers: true })}
              />
              <label htmlFor="yes">Yes</label>
            </div>
            <div id="radio-text">
              <input
                type="radio"
                id="no"
                name="chargeCustomers"
                checked={!userDetails.charge_customers}
                onChange={() => setUserDetails({ ...userDetails, charge_customers: false })}
              />
              <label htmlFor="no">No</label>
            </div>
          </div>
          {userDetails.charge_customers && (
            <>
              <div className="question-set2">
                <p>Custom Song Request Amount-</p>
                <input
                  type="number"
                  value={userDetails.custom_song_request_amount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                />
              </div>
  
              <div className="question-set3">
                <p>Regular Song Request Amounts,<br /> from high to low-</p>
                {userDetails.regular_song_request_amounts.map((amount, index) => (
                  <input
                    key={index}
                    type="number"
                    value={amount}
                    onChange={(e) => handleRegularAmountChange(index, e.target.value)}
                  />
                ))}
              </div>
            </>
          )}
          {userDetails.charge_customers && (
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isSaveButtonEnabled}
          >
            Save
          </button>
        </div>
      </div>
    );
  };
  
  export default Dashboard;
