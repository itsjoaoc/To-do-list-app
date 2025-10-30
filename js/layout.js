//select current day tasks
let liDay = document.getElementById('liDay');
liDay.addEventListener('click', function () {
    handleActiveNavLink(liDay.id);
    renderTaskTable();
});

//select current week tasks
let liWeek = document.getElementById('liWeek');
liWeek.addEventListener('click', function () {
    handleActiveNavLink(liWeek.id);
    renderTaskTable();
});

//select current month tasks
let liMonth = document.getElementById('liMonth');
liMonth.addEventListener('click', function () {
    handleActiveNavLink(liMonth.id);
    renderTaskTable();
});

//select overdue tasks
let liOverdue = document.getElementById('liOverdue');
liOverdue.addEventListener('click', function () {
    displayOverdueTasksCount();
    handleActiveNavLink(liOverdue.id);
    renderTaskTable();
});

//function to handle the active link in the sidebar
function handleActiveNavLink(liElementId) {

    //get the selected link
    let selectedLink = document.querySelector(`#${liElementId} a`);

    if (selectedLink) {

        //remove the custom-link-active class from all links
        let navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            let link = item.querySelector('.nav-link');
            link.classList.remove('custom-link-active');
            if (link.id !== 'aOverdue') {
                link.classList.add('link-light');
            }
            else {
                link.classList.add('link-danger');
            }
        });

        //add the custom-link-active class to the clicked link
        if (!selectedLink.classList.contains('custom-link-active')) { selectedLink.classList.add('custom-link-active'); }
        //remove unnecessary classes
        if (selectedLink.id !== 'aOverdue') {
            selectedLink.classList.remove('link-light');
        }
        else {
            selectedLink.classList.remove('link-danger');
        }
    }
}