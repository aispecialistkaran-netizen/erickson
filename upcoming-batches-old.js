// Erickson Coaching Batch Calendar
document.addEventListener('DOMContentLoaded', function() {
    // Batch data
    const batchData = {
        basic: [
            {
                batchNumber: 61,
                startDate: '2025-11-27',
                endDate: '2025-12-21',
                title: 'Basic Coaching Certification - Batch 61',
                duration: '25 days',
                format: 'Hybrid'
            },
            {
                batchNumber: 62,
                startDate: '2026-01-22',
                endDate: '2026-02-15',
                title: 'Basic Coaching Certification - Batch 62',
                duration: '25 days',
                format: 'Hybrid'
            },
            {
                batchNumber: 63,
                startDate: '2026-03-19',
                endDate: '2026-03-22',
                title: 'Basic Coaching Certification - Part I',
                duration: '4 days',
                format: 'Hybrid'
            },
            {
                batchNumber: 64,
                startDate: '2026-03-26',
                endDate: '2026-03-29',
                title: 'Basic Coaching Certification - Part I (additional)',
                duration: '4 days',
                format: 'Hybrid'
            },
            {
                batchNumber: 65,
                startDate: '2026-04-09',
                endDate: '2026-04-12',
                title: 'Basic Coaching Certification - Part II',
                duration: '4 days',
                format: 'Hybrid'
            },
            {
                batchNumber: 66,
                startDate: '2026-04-16',
                endDate: '2026-04-19',
                title: 'Basic Coaching Certification - Part II (additional)',
                duration: '4 days',
                format: 'Hybrid'
            },
            {
                batchNumber: 64,
                startDate: '2026-06-04',
                endDate: '2026-06-28',
                title: 'Basic Coaching Certification - Batch 64',
                duration: '25 days',
                format: 'Hybrid'
            }
        ],
        advanced: [
            {
                batchNumber: 61,
                startDate: '2025-10-30',
                endDate: '2025-11-23',
                title: 'Advanced Coaching Certification - Batch 61',
                duration: '25 days',
                format: 'In-person'
            },
            {
                batchNumber: 63,
                startDate: '2026-04-29',
                endDate: '2026-05-24',
                title: 'Advanced Coaching Certification - Batch 63',
                duration: '26 days',
                format: 'In-person'
            }
        ]
    };

    // Current state - Start from October 2025 (first batch starts)
    let currentDate = new Date(2025, 9, 1); // October 2025
    let selectedBatchFilter = 'all';

    // DOM elements
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const basicCalendar = document.getElementById('basic-calendar');
    const advancedCalendar = document.getElementById('advanced-calendar');
    const batchFilters = document.querySelectorAll('.batch-filter');
    const batchInfoPanel = document.getElementById('batch-info-panel');
    const batchDetails = document.getElementById('batch-details');
    const basicBatchCount = document.getElementById('basic-batch-count');
    const advancedBatchCount = document.getElementById('advanced-batch-count');

    // Month names
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Initialize calendar on page load
    init();

    // Mobile touch handling
    function handleMobileTouch() {
        // Prevent zoom on double tap for better UX
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    // Initialize mobile handling
    if (window.innerWidth <= 768) {
        handleMobileTouch();
    }

    function init() {
        console.log('Initializing calendar with batch data:', batchData);
        
        // Set current date to October 2025 to show the first upcoming batch
        currentDate = new Date(2025, 9, 1); // October 2025 (month is 0-based)
        
        setupEventListeners();
        renderCalendars();
        updateBatchCounts();
    }

    function setupEventListeners() {
        // Month navigation
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendars();
        });

        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendars();
        });

        // Batch filters
        batchFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                console.log('Filter clicked:', e.target.dataset.batch);
                selectedBatchFilter = e.target.dataset.batch;
                console.log('Selected filter:', selectedBatchFilter);
                updateActiveFilter(e.target);
                
                // Auto-navigate to the first occurrence of the selected batch
                if (selectedBatchFilter !== 'all') {
                    navigateToFirstBatchOccurrence(selectedBatchFilter);
                }
                
                renderCalendars();
                updateBatchCounts();
            });
        });
    }

    function updateActiveFilter(activeButton) {
        batchFilters.forEach(btn => {
            btn.classList.remove('active', 'bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        });
        activeButton.classList.remove('bg-gray-100', 'text-gray-700');
        activeButton.classList.add('active', 'bg-blue-600', 'text-white');
    }

    function renderCalendars() {
        updateCurrentMonthDisplay();
        renderBasicCalendar();
        renderAdvancedCalendar();
    }

    function updateCurrentMonthDisplay() {
        const monthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        currentMonthElement.textContent = monthYear;
        console.log('Current month:', monthYear);
    }

    function renderBasicCalendar() {
        const calendarHTML = generateCalendarHTML('basic');
        basicCalendar.innerHTML = calendarHTML;
        addCalendarEventListeners(basicCalendar, 'basic');
    }

    function renderAdvancedCalendar() {
        const calendarHTML = generateCalendarHTML('advanced');
        advancedCalendar.innerHTML = calendarHTML;
        addCalendarEventListeners(advancedCalendar, 'advanced');
    }

    function generateCalendarHTML(type) {
        // Generate calendar header
        let headerHTML = '<div class="calendar-header">';
        dayNames.forEach(day => {
            headerHTML += `<div class="calendar-header-day">${day}</div>`;
        });
        headerHTML += '</div>';

        // Generate calendar body
        let bodyHTML = '<div class="calendar-body">';
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Previous month's trailing days
        const prevMonth = new Date(year, month, 0);
        const daysInPrevMonth = prevMonth.getDate();
        
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const dayNumber = daysInPrevMonth - i;
            bodyHTML += `<div class="calendar-day other-month" data-date="${year}-${String(month).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}">
                <div class="day-number">${dayNumber}</div>
            </div>`;
        }

        // Current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const batches = getBatchesForDate(dateStr, type);
            let batchHTML = '';
            
            // Debug log for specific dates
            if (dateStr === '2026-01-22' || dateStr === '2026-03-19' || dateStr === '2026-06-04') {
                console.log(`Checking ${dateStr} for ${type}:`, batches);
            }
            
            batches.forEach(batch => {
                if (shouldShowBatch(batch)) {
                    const isStart = batch.startDate === dateStr;
                    const isEnd = batch.endDate === dateStr;
                    let batchClass = `batch-${type}`;
                    
                    if (isStart) batchClass += ' batch-start';
                    else if (isEnd) batchClass += ' batch-end';
                    
                    const batchText = isStart ? `Batch ${batch.batchNumber} Start` :
                                    isEnd ? `Batch ${batch.batchNumber} End` :
                                    `Batch ${batch.batchNumber}`;
                    
                    batchHTML += `<div class="batch-indicator ${batchClass}" data-batch="${batch.batchNumber}">${batchText}</div>`;
                    
                    console.log(`Added batch indicator: ${batchText} on ${dateStr}`);
                }
            });

            bodyHTML += `<div class="calendar-day" data-date="${dateStr}" data-type="${type}">
                <div class="day-number">${day}</div>
                ${batchHTML}
            </div>`;
        }

        // Next month's leading days
        const remainingCells = 42 - (startingDayOfWeek + daysInMonth);
        for (let day = 1; day <= remainingCells; day++) {
            const nextMonthYear = month === 11 ? year + 1 : year;
            const nextMonth = month === 11 ? 0 : month + 1;
            const dateStr = `${nextMonthYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            bodyHTML += `<div class="calendar-day other-month" data-date="${dateStr}">
                <div class="day-number">${day}</div>
            </div>`;
        }

        bodyHTML += '</div>';
        
        return headerHTML + bodyHTML;
    }

    function getBatchesForDate(dateStr, type) {
        const date = new Date(dateStr);
        const batches = batchData[type] || [];
        
        const matchingBatches = batches.filter(batch => {
            const startDate = new Date(batch.startDate);
            const endDate = new Date(batch.endDate);
            const matches = date >= startDate && date <= endDate;
            
            return matches;
        });
        
        return matchingBatches;
    }

    function shouldShowBatch(batch) {
        const shouldShow = selectedBatchFilter === 'all' || 
                          selectedBatchFilter === batch.batchNumber.toString();
        console.log(`Should show batch ${batch.batchNumber}? ${shouldShow} (filter: ${selectedBatchFilter})`);
        return shouldShow;
    }

    function navigateToFirstBatchOccurrence(batchNumber) {
        const batchNum = parseInt(batchNumber);
        let earliestDate = null;
        
        // Find the earliest start date for this batch across both basic and advanced
        ['basic', 'advanced'].forEach(type => {
            const batches = batchData[type] || [];
            batches.forEach(batch => {
                if (batch.batchNumber === batchNum) {
                    const startDate = new Date(batch.startDate);
                    if (!earliestDate || startDate < earliestDate) {
                        earliestDate = startDate;
                    }
                }
            });
        });
        
        if (earliestDate) {
            console.log('Navigating to:', earliestDate);
            currentDate = new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1);
        }
    }

    function getRegistrationURL(type) {
        if (type === 'basic') {
            return 'https://www.erickson.co.in/the-art-and-science-of-coaching.html';
        } else if (type === 'advanced') {
            return 'https://www.erickson.co.in/the-art-and-science-of-coaching-2.html';
        }
        return '';
    }

    function addCalendarEventListeners(calendar, type) {
        const calendarDays = calendar.querySelectorAll('.calendar-day');
        calendarDays.forEach(day => {
            day.addEventListener('click', (e) => {
                const dateStr = e.currentTarget.dataset.date;
                const batches = getBatchesForDate(dateStr, type);
                
                if (batches.length > 0 && shouldShowBatch(batches[0])) {
                    showBatchInfo(batches[0], dateStr, type);
                }
            });
        });
    }

    function showBatchInfo(batch, dateStr, type) {
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        const typeIcon = type === 'basic' ? 
            '<i class="fas fa-graduation-cap text-blue-600 mr-2"></i>' : 
            '<i class="fas fa-star text-yellow-600 mr-2"></i>';

        const typeColor = type === 'basic' ? 'blue' : 'yellow';

        batchDetails.innerHTML = `
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h5 class="text-lg font-semibold mb-4">
                        ${typeIcon}${batch.title}
                    </h5>
                    
                    <div class="space-y-3">
                        <div class="flex items-center">
                            <i class="fas fa-calendar text-${typeColor}-600 w-5 mr-3"></i>
                            <div>
                                <div class="text-sm font-medium">Start Date</div>
                                <div class="text-sm text-gray-600">${formatDate(batch.startDate)}</div>
                            </div>
                        </div>
                        
                        <div class="flex items-center">
                            <i class="fas fa-calendar-check text-${typeColor}-600 w-5 mr-3"></i>
                            <div>
                                <div class="text-sm font-medium">End Date</div>
                                <div class="text-sm text-gray-600">${formatDate(batch.endDate)}</div>
                            </div>
                        </div>
                        
                        <div class="flex items-center">
                            <i class="fas fa-clock text-${typeColor}-600 w-5 mr-3"></i>
                            <div>
                                <div class="text-sm font-medium">Duration</div>
                                <div class="text-sm text-gray-600">${batch.duration}</div>
                            </div>
                        </div>
                        
                        <div class="flex items-center">
                            <i class="fas fa-desktop text-${typeColor}-600 w-5 mr-3"></i>
                            <div>
                                <div class="text-sm font-medium">Format</div>
                                <div class="text-sm text-gray-600">${batch.format}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                    <h6 class="font-semibold mb-3">
                        <i class="fas fa-info-circle text-${typeColor}-600 mr-2"></i>Selected Date Info
                    </h6>
                    
                    <div class="space-y-2 text-sm">
                        <div><strong>Date:</strong> ${formattedDate}</div>
                        <div><strong>Batch:</strong> ${batch.batchNumber}</div>
                        <div><strong>Type:</strong> ${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                        <div><strong>Status:</strong> <span class="text-green-600 font-medium">Available</span></div>
                    </div>
                    
                    <button onclick="window.open('${getRegistrationURL(type)}', '_blank')" class="w-full mt-4 bg-${typeColor}-600 hover:bg-${typeColor}-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                        <i class="fas fa-user-plus mr-2"></i>Register Now
                    </button>
                </div>
            </div>
        `;
        
        batchInfoPanel.classList.remove('hidden');
        batchInfoPanel.classList.add('show');
        
        // Smooth scroll to panel
        setTimeout(() => {
            batchInfoPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    function updateBatchCounts() {
        const basicCount = selectedBatchFilter === 'all' ? 
            batchData.basic.length : 
            batchData.basic.filter(b => b.batchNumber.toString() === selectedBatchFilter).length;
            
        const advancedCount = selectedBatchFilter === 'all' ? 
            batchData.advanced.length : 
            batchData.advanced.filter(b => b.batchNumber.toString() === selectedBatchFilter).length;
        
        basicBatchCount.textContent = `${basicCount} batch${basicCount !== 1 ? 'es' : ''} available`;
        advancedBatchCount.textContent = `${advancedCount} batch${advancedCount !== 1 ? 'es' : ''} available`;
    }
});
