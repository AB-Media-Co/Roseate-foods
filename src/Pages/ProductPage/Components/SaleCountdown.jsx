import { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center justify-center  bg-opacity-10 backdrop-blur-sm border-2 border-white border-opacity-30 rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[85px]">
        <div className="text-subheading font-bold text-white tabular-nums">
            {String(value).padStart(2, '0')}
        </div>
        <div className="text-small text-white opacity-90 uppercase mt-1 font-medium">
            {label}
        </div>
    </div>
);

export default function SaleCountdown() {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const navigate = useNavigate()

    useEffect(() => {
        const startTimeKey = 'saleStartTime';
        let startTime = sessionStorage.getItem(startTimeKey);

        if (!startTime) {
            startTime = Date.now();
            sessionStorage.setItem(startTimeKey, startTime.toString());
        } else {
            startTime = parseInt(startTime);
        }

        const updateTimer = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const totalSeconds = 12 * 60 * 60;
            const remainingSeconds = Math.max(0, totalSeconds - Math.floor(elapsed / 1000));

            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const seconds = remainingSeconds % 60;

            setTimeLeft({ hours, minutes, seconds });

            if (remainingSeconds <= 0) {
                sessionStorage.removeItem(startTimeKey);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, []);

    const timeUnits = [
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Minutes' },
        { value: timeLeft.seconds, label: 'Seconds' }
    ];

    return (
        <div className='content'>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/Home/CountdownImg.png')" }}
                />
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: '#137D67A8' }}
                />

                <div className="relative z-10 px-4  py-8 md:px-12 md:py-12">
                    <div className="flex flex-col text-center  items-center   lg:justify-between gap-6">
                        <div className="flex-1">
                            <h2 className="text-subheading text-white capitalize mb-2">
                                Get ready! our biggest sale
                                <br className='hidden lg:block' /> ever starts in...
                            </h2>

                        </div>

                        <div className='flex flex-col  items-center gap-6 md:gap-10'>

                            <div className="flex gap-3  md:gap-4">
                                {timeUnits.map((unit, index) => (
                                    <TimeBox key={index} value={unit.value} label={unit.label} />
                                ))}

                            </div>
                            <Button
                                variant="outline"
                                size="btn"
                                className=""
                                onClick={() => navigate('/collection/allproducts')}
                            >
                                View All The Products
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}