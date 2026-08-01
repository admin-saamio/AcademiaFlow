document.addEventListener('alpine:init', () => {
    Alpine.data('academiaFlow', () => ({
        activeTab: 'home',
        showPreloader: false,
        showInstallBanner: false,
        deferredPrompt: null,
        toastMessage: '',

        // Data State
        state: {
            studentName: '',
            academicLevel: 'undergraduate',
            school: { grade: 'Grade 10', exams: [] },
            undergraduate: [],
            postgraduate: [],
            doctorate: [],
            todos: [],
            notes: []
        },

        init() {
            // Preloader Logic
            if (!sessionStorage.getItem('academiaflow_preloader_seen')) {
                this.showPreloader = true;
                setTimeout(() => { this.dismissPreloader(); }, 5000);
            }

            // Load Data
            const saved = localStorage.getItem('academiaflow_data');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.academicLevel) this.state = { ...this.state, ...parsed };
                } catch (e) { console.error('Failed to load data', e); }
            }

            // Auto-save watcher
            this.$watch('state', value => {
                localStorage.setItem('academiaflow_data', JSON.stringify(value));
            });

            // PWA Logic
            const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
            const isStandalone = ('standalone' in window.navigator) && window.navigator.standalone;

            if (isIos && !isStandalone && !localStorage.getItem('pwa_banner_dismissed')) {
                this.showInstallBanner = true;
            }

            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                this.deferredPrompt = e;
                if (!localStorage.getItem('pwa_banner_dismissed')) {
                    this.showInstallBanner = true;
                }
            });
        },

        dismissPreloader() {
            this.showPreloader = false;
            sessionStorage.setItem('academiaflow_preloader_seen', 'true');
        },

        async installApp() {
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                await this.deferredPrompt.userChoice;
                this.deferredPrompt = null;
                this.showInstallBanner = false;
            } else {
                alert("To install on iOS: tap the Share button at the bottom of Safari, then select 'Add to Home Screen'.");
            }
        },

        dismissInstallBanner() {
            this.showInstallBanner = false;
            localStorage.setItem('pwa_banner_dismissed', 'true');
        },

        showToast(msg) {
            this.toastMessage = msg;
            setTimeout(() => { this.toastMessage = ''; }, 3000);
        },

        // Data Management
        exportJSON() {
            const dataStr = JSON.stringify(this.state, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const link = document.createElement('a');
            link.href = dataUri;
            link.download = `academiaflow-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            this.showToast('JSON Exported Successfully!');
            this.triggerConfetti();
        },

        exportCSV() {
            let csv = "data:text/csv;charset=utf-8,";
            const esc = (s) => `"${String(s || '').replace(/"/g, '""')}"`;
            const n = esc(this.state.studentName || 'Student');

            csv += "=== SCHOOL RECORDS ===\nStudent Name,Grade,Exam Name,Institution,Year,Subject,Max,Obtained\n";
            this.state.school.exams.forEach(ex => {
                if (ex.subjects.length === 0) csv += `${n},${esc(this.state.school.grade)},${esc(ex.name)},${esc(ex.inst)},${esc(ex.year)},N/A,0,0\n`;
                ex.subjects.forEach(sub => csv += `${n},${esc(this.state.school.grade)},${esc(ex.name)},${esc(ex.inst)},${esc(ex.year)},${esc(sub.name)},${sub.max},${sub.obt}\n`);
            });

            csv += "\n=== UNDERGRADUATE ===\nStudent Name,Degree,College,Years,Semester,SGPA,Subject,Max,Obtained\n";
            this.state.undergraduate.forEach(ug => {
                ug.sems.forEach(sem => {
                    if(sem.subs.length === 0) csv += `${n},${esc(ug.name)},${esc(ug.col)},${ug.yrs},${sem.num},${sem.sgpa},N/A,0,0\n`;
                    sem.subs.forEach(sub => csv += `${n},${esc(ug.name)},${esc(ug.col)},${ug.yrs},${sem.num},${sem.sgpa},${esc(sub.name)},${sub.max},${sub.obt}\n`);
                });
            });

            csv += "\n=== TASKS & NOTES ===\nType,Title,Detail,Status\n";
            this.state.todos.forEach(t => csv += `Task,${esc(t.title)},${esc(t.deadline)},${t.done ? 'Done' : 'Pending'}\n`);
            this.state.notes.forEach(nt => csv += `Note,${esc(nt.title)},${esc(nt.content)},N/A\n`);

            const link = document.createElement("a");
            link.href = encodeURI(csv);
            link.download = `academiaflow-export.csv`;
            link.click();
            this.showToast('CSV Exported Successfully!');
            this.triggerConfetti();
        },

        importData(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    if (json && json.academicLevel) {
                        this.state = json;
                        this.showToast('Data Imported Successfully!');
                        this.triggerConfetti();
                    } else { alert("Invalid backup file."); }
                } catch (err) { alert("Error parsing file."); }
            };
            reader.readAsText(file);
        },

        triggerConfetti() {
            if(typeof confetti === 'function') {
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
            }
        },

        // Helpers
        addSchoolExam() {
            this.state.school.exams.push({ id: Date.now(), name: 'Mid Terms', inst: 'School Name', year: '2024', subjects: [] });
        },
        removeSchoolExam(idx) { this.state.school.exams.splice(idx, 1); },
        addSchoolSub(eIdx) {
            this.state.school.exams[eIdx].subjects.push({ id: Date.now(), name: 'Math', obt: 80, max: 100 });
        },
        removeSchoolSub(eIdx, sIdx) { this.state.school.exams[eIdx].subjects.splice(sIdx, 1); },

        addUgDegree() {
            this.state.undergraduate.push({ id: Date.now(), name: 'B.Sc', col: 'University', yrs: 3, sems: [ {num:1, sgpa:0, subs:[]} ] });
        },
        removeUgDegree(idx) { this.state.undergraduate.splice(idx, 1); },
        addUgSem(dIdx) {
            const num = this.state.undergraduate[dIdx].sems.length + 1;
            this.state.undergraduate[dIdx].sems.push({ num, sgpa: 0, subs: [] });
        },
        addUgSub(dIdx, sIdx) {
            this.state.undergraduate[dIdx].sems[sIdx].subs.push({ id: Date.now(), name: 'Course', obt: 0, max: 100 });
        },
        removeUgSub(dIdx, sIdx, subIdx) { this.state.undergraduate[dIdx].sems[sIdx].subs.splice(subIdx, 1); },

        addTask() {
            const title = prompt("Task title:");
            if(title) this.state.todos.unshift({ id: Date.now(), title, deadline: new Date().toISOString().split('T')[0], done: false });
        },
        removeTask(idx) { this.state.todos.splice(idx, 1); },

        addNote() {
            const title = prompt("Note title:");
            const content = prompt("Content:");
            if(title && content) this.state.notes.unshift({ id: Date.now(), title, content });
        },
        removeNote(idx) { this.state.notes.splice(idx, 1); }
    }));
});
