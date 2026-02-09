import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGoogleSheet } from "../services/googleSheet";


// --- helpers ---
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const formatDateStr = (date) => {
  //this will format a Date object to "Jan-1" format
  return `${MONTHS[date.getMonth()]}-${date.getDate()}`;
};

export const parseDate = (str) => {
  //this will parse strings like "Jan-1" to a Date object
  if (!str) return null;
  const [a, b] = String(str).trim().split("-");
  const am = MONTHS.indexOf(a), bm = MONTHS.indexOf(b);
  let month, day;
  if (am !== -1) { month = am; day = parseInt(b, 10); }
  else if (bm !== -1) { month = bm; day = parseInt(a, 10); }
  else return null;
  if (isNaN(day)) return null;
  const y = new Date().getFullYear();
  const d = new Date(y, month, day);
  d.setHours(0,0,0,0);
  return d;
};

export const getTodayStr = () => {
  const today = new Date();
  return formatDateStr(today);
};

export const getStaffNames = (data) => {
  if (!data || !data[0]) return [];
  return data[0]
    .filter((h) => h && h.trim() !== "")
    .map((h) => ({ name: h }));
};

export const getDaysAndDates = (data) => {
  if (!data || data.length < 2) return [];
  return data
    .slice(1)
    .filter((row) => row[0] && row[1] && row[0].length <= 3)
    .map((row) => ({ day: row[0], date: row[1] }));
};

export const getWorkersSchedule = (data) => {
  if (!data || data.length < 2) return [];
  const staff = getStaffNames(data).map((s) => s.name);
  const schedule = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0] && row[1] && row[0].length <= 3) {
      const workers = [];
      for (let w = 0; w < staff.length; w++) {
        const fromIdx = 2 + w * 3;
        const toIdx = fromIdx + 1;
        const from = row[fromIdx];
        const to = row[toIdx];
        if (from || to) {
          workers.push({
            name: staff[w] || `Worker${w + 1}`,
            from: from || "",
            to: to || "",
          });
        }
      }
      schedule.push({ day: row[0], date: row[1], workers });
    }
  }
  return schedule;
};

export const getStaffScheduleByDay = (data) => {
  if (!data || data.length < 2) return [];
  const header = data[0];
  const workers = [];

  for (let col = 3, workerId = 0; col < header.length; col += 3, workerId++) {
    const name = header[col];
    if (name && name.trim() !== "") {
      workers.push({ workerId, name: name.trim(), scheduled: {} });
    }
  }

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0] && row[1] && row[0].length <= 3) {
      const dayKey = `${row[1].split("-")[1]}-${row[1].split("-")[0]}`;
      for (let w = 0; w < workers.length; w++) {
        const fromIdx = 2 + w * 3;
        const toIdx = fromIdx + 1;
        const hoursIdx = fromIdx + 2;
        const from = row[fromIdx];
        const to = row[toIdx];
        const hours = row[hoursIdx];
        if (from || to || hours) {
          workers[w].scheduled[dayKey] = { from: from || "", to: to || "", hours: hours || "" };
        }
      }
    }
  }

  return workers;
};

export const getTodaySchedule = (data) => {
  if (!data || data.length < 2) return null;
  const todayStr = getTodayStr();
  let todayRow = data.find((row) => row[1] === todayStr);

  if (!todayRow) {
    todayRow = data.find((row) => row[0] && row[1] && row[0].length <= 3);
  }
  if (!todayRow) return null;

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
          hours: hours || "",
        });
      }
    }
  }

  return { day: todayRow[0], date: todayRow[1], workers };
};

export const getNextDaySchedule = (data, currentDateStr) => {
  if (!data || data.length < 2 || !currentDateStr) return null;
  const validRows = data.filter((row) => row[0] && row[1] && row[0].length <= 3);
  const currentIdx = validRows.findIndex((row) => row[1] === currentDateStr);
  const nextRow = currentIdx >= 0 && currentIdx < validRows.length - 1 ? validRows[currentIdx + 1] : null;
  if (!nextRow) return null;

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
          hours: hours || "",
        });
      }
    }
  }

  return { day: nextRow[0], date: nextRow[1], workers };
};

export const getScheduleByWorker = (data) => {
  if (!data || data.length < 2) return {};
  const header = data[0];
  const result = {};

  for (let col = 3, workerId = 0; col < header.length; col += 3, workerId++) {
    const name = header[col];
    if (name && name.trim() !== "") {
      result[name.trim()] = {};
    }
  }

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0] && row[1] && row[0].length <= 3) {
      const dateKey = row[1]; // e.g. Jan-1
      for (let w = 0; w < Object.keys(result).length; w++) {
        const fromIdx = 2 + w * 3;
        const toIdx = fromIdx + 1;
        const hoursIdx = fromIdx + 2;
        const from = row[fromIdx];
        const to = row[toIdx];
        const hours = row[hoursIdx];
        const workerName = header[3 + w * 3];
        if (workerName && workerName.trim() !== "" && (from || to || hours)) {
          result[workerName.trim()][dateKey] = {
            from: from || "",
            to: to || "",
            hours: hours || ""
          };
        }
      }
    }
  }

  return result;
};

export const getFullScheduleInfo = (data) => {
  const todayStr = getTodayStr();
  return {
    staff: getStaffNames(data),
    daysAndDates: getDaysAndDates(data),
    schedule: getWorkersSchedule(data),
    staffWithShift: getStaffScheduleByDay(data),
    todaySchedule: getTodaySchedule(data),
    individualSchedule: getScheduleByWorker(data),
    nextDaySchedule: getNextDaySchedule(data, todayStr),
  };
};

// --- thunk ---
export const fetchSheetData = createAsyncThunk("app/fetchSheetData", async (url) => {
  const data = await fetchGoogleSheet(url);
  return data;
});

// --- slice ---
export const appSlice = createSlice({
  name: "app",
  initialState: {
    isLoading: true,
    currentLang: "fi",
    isModal: false,
    data: [],
    staff: [],
    daysAndDates: [],
    schedule: [],
    staffWithShift: [],
    todaySchedule: null,
    workers: {},
    nextDaySchedule: null,
  },
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setCurrentLang(state, action) {
      state.currentLang = action.payload;
    },
    toggleIsModal(state) {
      state.isModal = !state.isModal;
    },
    togglePicModal(state) {
      state.isPicModal = !state.isPicModal;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSheetData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSheetData.fulfilled, (state, action) => {
        state.data = action.payload;
        console.log(state.data)
        const scheduleInfo = getFullScheduleInfo(state.data);
        state.staff = scheduleInfo.staff;
        state.daysAndDates = scheduleInfo.daysAndDates;
        state.schedule = scheduleInfo.schedule;
        state.staffWithShift = scheduleInfo.staffWithShift;
        state.todaySchedule = scheduleInfo.todaySchedule;
        state.nextDaySchedule = scheduleInfo.nextDaySchedule;
        state.workers = scheduleInfo.individualSchedule;
        state.isLoading = false;
      })
      .addCase(fetchSheetData.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { 
  setIsLoading, 
  setCurrentLang, 
  toggleIsModal, 
  togglePicModal 
} = appSlice.actions;
export default appSlice.reducer;
