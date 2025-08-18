const today = new Date();
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const todayStr = `${monthNames[today.getMonth()]}-${today.getDate()}`;

export const getStaffNames = (data) => {
    if (!data || !data[0]) return [];
    const staff = [];
    const header = data[0];
    for (let i = 0; i < header.length; i++) {
        if (header[i] && header[i].toLowerCase() !== "") {
            staff.push({ name: header[i] });
        }
    }
    return staff;
}

export const getDaysAndDates = (data) => {
    if (!data || data.length < 2) return [];
    const daysAndDates = [];
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        // Only push if row looks like a valid day row
        if (row[0] && row[1] && row[0].length <= 3) {
            daysAndDates.push({ day: row[0], date: row[1] });
        }
    }
    return daysAndDates;
};

export const getWorkersSchedule = (data) => {
    if (!data || data.length < 2) return [];
    const staff = getStaffNames(data).map(s => s.name); // get array of names
    const schedule = [];

    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        // Only process rows that look like a valid day row
        if (row[0] && row[1] && row[0].length <= 3) {
            const workers = [];
            // Start from column 2, each worker uses 3 columns: from, to, total
            for (let w = 0; w < staff.length; w++) {
                const fromIdx = 2 + w * 3;
                const toIdx = fromIdx + 1;
                // const totalIdx = fromIdx + 2; // not used here
                const from = row[fromIdx];
                const to = row[toIdx];
                if (from || to) {
                    workers.push({
                        name: staff[w] || `Worker${w + 1}`,
                        from: from || "",
                        to: to || ""
                    });
                }
            }
            schedule.push({
                day: row[0],
                date: row[1],
                workers
            });
        }
    }
    return schedule;
};

export const getStaffScheduleByDay = (data) => {
    if (!data || data.length < 2) return [];
    const header = data[0];

    // Get worker names and their index
    const workers = [];
    // Worker names are in header: columns 3, 6, 9, ...
    for (let col = 3, workerId = 0; col < header.length; col += 3, workerId++) {
        const name = header[col];
        if (name && name.trim() !== "") {
            workers.push({ workerId, name: name.trim(), scheduled: {} });
        }
    }

    // Loop through each day row
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        // Only process valid day rows
        if (row[0] && row[1] && row[0].length <= 3) {
            // Build a key for the day, e.g. "m_18_8"
            const dayKey = `${row[1].split('-')[1]}-${row[1].split('-')[0]}`;
            // For each worker, get their shift info
            for (let w = 0; w < workers.length; w++) {
                const fromIdx = 2 + w * 3;
                const toIdx = fromIdx + 1;
                const hoursIdx = fromIdx + 2;
                const from = row[fromIdx];
                const to = row[toIdx];
                const hours = row[hoursIdx];
                if (from || to || hours) {
                    workers[w].scheduled[dayKey] = {
                        from: from || "",
                        to: to || "",
                        hours: hours || ""
                    };
                }
            }
        }
    }

    return workers;
};



export const getTodaySchedule = (data) => {
    if (!data || data.length < 2) return null;

    // Get today's date string in format "Aug-18"
    const today = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const todayStr = `${monthNames[today.getMonth()]}-${today.getDate()}`;

    // Find the row for today
    let todayRow = data.find(row => row[1] === todayStr);

    // If not found, get the earliest available valid schedule row
    if (!todayRow) {
        todayRow = data.find(row => row[0] && row[1] && row[0].length <= 3);
    }
    if (!todayRow) return null;

    // Build schedule for todayRow
    const header = data[0];
    const workers = [];
    for (let col = 3, workerId = 0; col < header.length; col += 3, workerId++) {
        const name = header[col];
        if (name && name.trim() !== "") {
            const fromIdx = 2 + workerId * 3;
            const toIdx = fromIdx + 1;
            const hoursIdx = fromIdx + 2;
            const from = todayRow[fromIdx];
            const to = todayRow[toIdx];
            const hours = todayRow[hoursIdx];
            if (from || to || hours) {
                workers.push({
                    workerId,
                    name: name.trim(),
                    from: from || "",
                    to: to || "",
                    hours: hours || ""
                });
            }
        }
    }

    return {
        day: todayRow[0],
        date: todayRow[1],
        workers
    };
};

export const getNextDaySchedule = (data, currentDateStr) => {
    if (!data || data.length < 2 || !currentDateStr) return null;

    // Find all valid schedule rows
    const validRows = data.filter(row => row[0] && row[1] && row[0].length <= 3);

    // Find index of the current date
    const currentIdx = validRows.findIndex(row => row[1] === currentDateStr);

    // Get the next row if available
    const nextRow = currentIdx >= 0 && currentIdx < validRows.length - 1
        ? validRows[currentIdx + 1]
        : null;

    if (!nextRow) return null;

    // Build schedule for nextRow
    const header = data[0];
    const workers = [];
    for (let col = 3, workerId = 0; col < header.length; col += 3, workerId++) {
        const name = header[col];
        if (name && name.trim() !== "") {
            const fromIdx = 2 + workerId * 3;
            const toIdx = fromIdx + 1;
            const hoursIdx = fromIdx + 2;
            const from = nextRow[fromIdx];
            const to = nextRow[toIdx];
            const hours = nextRow[hoursIdx];
            if (from || to || hours) {
                workers.push({
                    workerId,
                    name: name.trim(),
                    from: from || "",
                    to: to || "",
                    hours: hours || ""
                });
            }
        }
    }

    return {
        day: nextRow[0],
        date: nextRow[1],
        workers
    };
};

export const getFullScheduleInfo = (data) => {
    return {
        staff: getStaffNames(data),
        daysAndDates: getDaysAndDates(data),
        schedule: getWorkersSchedule(data),
        staffWithShift: getStaffScheduleByDay(data),
        todaySchedule: getTodaySchedule(data),
        nextDaySchedule: getNextDaySchedule(data, todayStr)    };
};