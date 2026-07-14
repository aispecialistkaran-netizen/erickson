document.addEventListener('DOMContentLoaded', function() {
    // State
    let currentDate = new Date(2025, 9, 1); // October 2025 (month is 0-based)
    let selectedBatchFilter = 'all';
    let currentCourseType = 'basic'; // 'basic' or 'advanced'
    
    // DOM Elements
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarGrid = document.getElementById('calendar-grid');
    const batchList = document.getElementById('batch-list');
    const batchFilters = document.querySelectorAll('.batch-filter');
    const basicToggle = document.getElementById('basic-toggle');
    const advancedToggle = document.getElementById('advanced-toggle');
    const batchInfoPanel = document.getElementById('batch-info-panel');
    const batchDetails = document.getElementById('batch-details');
    const closeBatchInfo = document.getElementById('close-batch-info');

    // Batch data
    const batchData = {
        basic: [
            {
                batchNumber: 61,
                startDate: '2025-11-27',
                endDate: '2025-12-21',
                title: 'Basic Coaching Certification - Batch 61',
                duration: '25 days',
                format: 'Hybrid',
                description: 'Foundational coaching skills and techniques'
            },
            {
                batchNumber: 62,
                startDate: '2026-01-22',
                endDate: '2026-02-15',
                title: 'Basic Coaching Certification - Batch 62',
                duration: '25 days',
                format: 'Hybrid',
                description: 'Foundational coaching skills and techniques'
            },
            {
                batchNumber: 63,
                startDate: '2026-03-19',
                endDate: '2026-03-22',
                title: 'Basic Coaching Certification - Part I',
                duration: '4 days',
                format: 'Hybrid',
                description: 'Part I — 19–22 Mar 2026'
            },
            {
                batchNumber: 64,
                startDate: '2026-03-26',
                endDate: '2026-03-29',
                title: 'Basic Coaching Certification - Part I (additional)',
                duration: '4 days',
                format: 'Hybrid',
                description: 'Part I — 26–29 Mar 2026'
            },
            {
                batchNumber: 65,
                startDate: '2026-04-09',
                endDate: '2026-04-12',
                title: 'Basic Coaching Certification - Part II',
                duration: '4 days',
                format: 'Hybrid',
                description: 'Part II — 9–12 Apr 2026'
            },
            {
                batchNumber: 66,
                startDate: '2026-04-16',
                endDate: '2026-04-19',
                title: 'Basic Coaching Certification - Part II (additional)',
                duration: '4 days',
                format: 'Hybrid',
                description: 'Part II — 16–19 Apr 2026'
            },
            {
                batchNumber: 64,
                startDate: '2026-06-04',
                endDate: '2026-06-28',
                title: 'Basic Coaching Certification - Batch 64',
                duration: '25 days',
                format: 'Hybrid',
                description: 'Foundational coaching skills and techniques'
            }
        ],
        advanced: [
            {
                batchNumber: 61,
                startDate: '2025-10-30',
                endDate: '2025-11-23',
                title: 'Advanced Coaching Certification - Batch 61',
                duration: '25 days',
                format: 'In-person',
                description: 'Advanced coaching methodologies and leadership'
            },
            {
                batchNumber: 63,
                startDate: '2026-04-29',
                endDate: '2026-05-24',
                title: 'Advanced Coaching Certification - Batch 63',
                duration: '26 days',
                format: 'In-person',
                description: 'Advanced coaching methodologies and leadership'
            }
        ]
    };

    // Initialize
    init();

    function init() {
        setupEventListeners();
        renderBatchList();
        renderCalendar();
        updateMonthDisplay();
    }

    function setupEventListeners() {
        // Month navigation
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateMonthDisplay();
            renderCalendar();
        });

        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateMonthDisplay();
            renderCalendar();
        });

        // Course type toggles
        basicToggle.addEventListener('click', () => {
            switchCourseType('basic');
        });

        advancedToggle.addEventListener('click', () => {
            switchCourseType('advanced');
        });

        // Batch filters
        batchFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                selectedBatchFilter = e.target.dataset.batch;
                updateActiveFilter(e.target);
                renderBatchList();
                renderCalendar();
                
                // Auto-navigate if specific batch selected
                if (selectedBatchFilter !== 'all') {
                    navigateToFirstBatchOccurrence(selectedBatchFilter);
                }
            });
        });

        // Modal close
        closeBatchInfo.addEventListener('click', closeBatchModal);
        batchInfoPanel.addEventListener('click', (e) => {
            if (e.target === batchInfoPanel) {
                closeBatchModal();
            }
        });
    }

    function switchCourseType(type) {
        currentCourseType = type;
        
        // Update toggle buttons
        if (type === 'basic') {
            basicToggle.className = 'py-2.5 px-5 rounded-lg bg-indigo-600 text-white text-sm font-medium transition-all duration-300';
            advancedToggle.className = 'py-2.5 px-5 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium transition-all duration-300';
        } else {
            basicToggle.className = 'py-2.5 px-5 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium transition-all duration-300';
            advancedToggle.className = 'py-2.5 px-5 rounded-lg bg-indigo-600 text-white text-sm font-medium transition-all duration-300';
        }
        
        renderBatchList();
        renderCalendar();
    }

    function updateActiveFilter(activeButton) {
        batchFilters.forEach(btn => {
            btn.className = 'batch-filter py-2.5 px-5 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium transition-all duration-300';
        });
        activeButton.className = 'batch-filter active py-2.5 px-5 rounded-lg bg-indigo-600 text-white text-sm font-medium transition-all duration-300';
    }

    function updateMonthDisplay() {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        currentMonthEl.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }

    function renderBatchList() {
        const batches = batchData[currentCourseType] || [];
        const filteredBatches = batches.filter(batch => 
            selectedBatchFilter === 'all' || selectedBatchFilter === batch.batchNumber.toString()
        );

        batchList.innerHTML = filteredBatches.map(batch => {
            const startDate = new Date(batch.startDate);
            const endDate = new Date(batch.endDate);
            const colorClass = currentCourseType === 'basic' ? 'blue' : 'purple';
            
            return `
                <div class="p-6 rounded-xl bg-white cursor-pointer hover:shadow-md transition-all duration-300" 
                     onclick="showBatchDetails('${batch.batchNumber}', '${currentCourseType}')">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2.5">
                            <span class="w-2.5 h-2.5 rounded-full bg-${colorClass}-600"></span>
                            <p class="text-base font-medium text-gray-900">
                                ${formatDateRange(batch.startDate, batch.endDate)}
                            </p>
                        </div>
                        <div class="text-xs text-gray-500">
                            ${batch.format}
                        </div>
                    </div>
                    <h6 class="text-xl leading-8 font-semibold text-black mb-1">
                        ${currentCourseType.charAt(0).toUpperCase() + currentCourseType.slice(1)} Batch ${batch.batchNumber}
                    </h6>
                    <p class="text-base font-normal text-gray-600">${batch.description}</p>
                    <div class="mt-3 text-sm text-gray-500">Duration: ${batch.duration}</div>
                </div>
            `;
        }).join('');
    }

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        let html = '';
        const today = new Date();
        
        for (let week = 0; week < 6; week++) {
            for (let day = 0; day < 7; day++) {
                const cellDate = new Date(startDate);
                cellDate.setDate(startDate.getDate() + (week * 7) + day);
                
                const isCurrentMonth = cellDate.getMonth() === month;
                const isToday = cellDate.toDateString() === today.toDateString();
                const batches = getBatchesForDate(cellDate);
                
                let cellClass = 'flex xl:aspect-square max-xl:min-h-[60px] p-3.5 relative transition-all duration-300 hover:bg-indigo-50 cursor-pointer';
                
                if (!isCurrentMonth) {
                    cellClass += ' bg-gray-50';
                } else {
                    cellClass += ' bg-white';
                }
                
                // Add borders based on position
                if (day < 6) cellClass += ' border-r border-indigo-200';
                if (week < 5) cellClass += ' border-b border-indigo-200';
                if (week === 5 && day === 0) cellClass += ' rounded-bl-xl';
                if (week === 5 && day === 6) cellClass += ' rounded-br-xl';
                
                let dayNumberClass = 'text-xs font-semibold';
                if (!isCurrentMonth) {
                    dayNumberClass += ' text-gray-400';
                } else if (isToday) {
                    dayNumberClass += ' text-white w-6 h-6 rounded-full flex items-center justify-center bg-indigo-600';
                } else {
                    dayNumberClass += ' text-gray-900';
                }
                
                let batchIndicators = '';
                if (batches.length > 0 && isCurrentMonth) {
                    batches.forEach((batch, index) => {
                        const colorClass = currentCourseType === 'basic' ? 'blue' : 'purple';
                        const batchStartDate = new Date(batch.startDate);
                        const batchEndDate = new Date(batch.endDate);
                        
                        const isStart = cellDate.toDateString() === batchStartDate.toDateString();
                        const isEnd = cellDate.toDateString() === batchEndDate.toDateString();
                        
                        batchIndicators += `
                            <div class="absolute top-9 bottom-1 left-3.5 p-1.5 xl:px-2.5 h-max rounded bg-${colorClass}-50">
                                <p class="hidden xl:block text-xs font-medium text-${colorClass}-600 mb-px whitespace-nowrap">
                                    Batch ${batch.batchNumber}
                                </p>
                                <span class="hidden xl:block text-xs font-normal text-${colorClass}-600 whitespace-nowrap">
                                    ${batch.format}
                                </span>
                                <p class="xl:hidden w-2 h-2 rounded-full bg-${colorClass}-600"></p>
                            </div>
                        `;
                    });
                }
                
                html += `
                    <div class="${cellClass}" data-date="${cellDate.toISOString().split('T')[0]}" onclick="handleDateClick('${cellDate.toISOString().split('T')[0]}')">
                        <span class="${dayNumberClass}">${cellDate.getDate()}</span>
                        ${batchIndicators}
                    </div>
                `;
            }
        }
        
        calendarGrid.innerHTML = html;
    }

    function getBatchesForDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        const batches = batchData[currentCourseType] || [];
        
        return batches.filter(batch => {
            const startDate = new Date(batch.startDate);
            const endDate = new Date(batch.endDate);
            const checkDate = new Date(dateStr);
            
            const isInRange = checkDate >= startDate && checkDate <= endDate;
            const matchesFilter = selectedBatchFilter === 'all' || 
                                selectedBatchFilter === batch.batchNumber.toString();
            
            return isInRange && matchesFilter;
        });
    }

    function formatDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    }

    function navigateToFirstBatchOccurrence(batchNumber) {
        const batchNum = parseInt(batchNumber);
        const batches = batchData[currentCourseType] || [];
        
        for (const batch of batches) {
            if (batch.batchNumber === batchNum) {
                const startDate = new Date(batch.startDate);
                currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
                updateMonthDisplay();
                renderCalendar();
                break;
            }
        }
    }

    // Global functions for onclick handlers
    window.handleDateClick = function(dateStr) {
        const date = new Date(dateStr);
        const batches = getBatchesForDate(date);
        
        if (batches.length > 0) {
            showBatchDetails(batches[0].batchNumber, currentCourseType);
        }
    };

    window.showBatchDetails = function(batchNumber, courseType) {
        const batches = batchData[courseType] || [];
        const batch = batches.find(b => b.batchNumber.toString() === batchNumber.toString());
        
        if (!batch) return;
        
        const registrationURL = getRegistrationURL(courseType);
        const colorClass = courseType === 'basic' ? 'blue' : 'purple';
        
        batchDetails.innerHTML = `
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h5 class="text-lg font-semibold mb-4 text-${colorClass}-600">
                        <i class="fas fa-graduation-cap mr-2"></i>${batch.title}
                    </h5>
                    
                    <div class="space-y-3">
                        <div class="flex items-center">
                            <i class="fas fa-calendar text-${colorClass}-600 w-5 mr-3"></i>
                            <div>
                                <div class="text-sm font-medium">Start Date</div>
                                <div class="text-sm text-gray-600">${formatDate(batch.startDate)}</div>
                            </div>
                        </div>
                        
                        <div class="flex items-center">
                            <i class="fas fa-calendar-check text-${colorClass}-600 w-5 mr-3"></i>
                            <div>
                                <div class="text-sm font-medium">End Date</div>
                                <div class="text-sm text-gray-600">${formatDate(batch.endDate)}</div>
                            </div>
                        </div>
                        
                        <div class="flex items-center">
                            <i class="fas fa-clock text-${colorClass}-600 w-5 mr-3"></i>
                            <div>
                                <div class="text-sm font-medium">Duration</div>
                                <div class="text-sm text-gray-600">${batch.duration}</div>
                            </div>
                        </div>
                        
                        <div class="flex items-center">
                            <i class="fas fa-desktop text-${colorClass}-600 w-5 mr-3"></i>
                            <div>
                                <div class="text-sm font-medium">Format</div>
                                <div class="text-sm text-gray-600">${batch.format}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4">
                    <h6 class="font-semibold mb-3">
                        <i class="fas fa-info-circle text-${colorClass}-600 mr-2"></i>Course Information
                    </h6>
                    
                    <div class="space-y-2 text-sm">
                        <div><strong>Batch:</strong> ${batch.batchNumber}</div>
                        <div><strong>Type:</strong> ${courseType.charAt(0).toUpperCase() + courseType.slice(1)}</div>
                        <div><strong>Description:</strong> ${batch.description}</div>
                        <div><strong>Status:</strong> <span class="text-green-600 font-medium">Available</span></div>
                    </div>
                    
                    <button onclick="window.open('${registrationURL}', '_blank')" 
                            class="w-full mt-4 bg-${colorClass}-600 hover:bg-${colorClass}-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                        <i class="fas fa-user-plus mr-2"></i>Register Now
                    </button>
                </div>
            </div>
        `;
        
        batchInfoPanel.classList.remove('hidden');
    };

    function closeBatchModal() {
        batchInfoPanel.classList.add('hidden');
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    function getRegistrationURL(type) {
        if (type === 'basic') {
            return 'https://www.erickson.co.in/the-art-and-science-of-coaching.html';
        } else if (type === 'advanced') {
            return 'https://www.erickson.co.in/the-art-and-science-of-coaching-2.html';
        }
        return '';
    }
});
