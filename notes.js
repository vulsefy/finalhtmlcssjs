 const addBox = document.querySelector(".add-box");
    const popupBox = document.querySelector(".popup-box");
    const popupTitle = popupBox.querySelector("header p");
    const closeIcon = popupBox.querySelector("header i");
    const titleTag = popupBox.querySelector("input");
    const descTag = popupBox.querySelector("textarea");
    const addBtn = popupBox.querySelector("button");
    const bodyTag = document.querySelector("body");

    const months = ["January", "February", "March", "April", "May", "June", "July",
                    "August", "September", "October", "November", "December"];
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");
    let isUpdate = false, updateId;

    addBox.addEventListener("click", () => {
      popupTitle.innerText = "Add a Note";
      addBtn.innerText = "Add Note";
      popupBox.classList.add("show");
      document.querySelector("body").style.overflow = "hidden";
      titleTag.focus(); // Always focus on the title tag when opening the form
      bodyTag.classList.add("popup-open"); // Add class to the body when popup is opened
    });

    closeIcon.addEventListener("click", () => {
      isUpdate = false;
      titleTag.value = descTag.value = "";
      popupBox.classList.remove("show");

      document.querySelector("body").style.overflow = "auto";
    });

    function showNotes() {
      if(!notes) return;
      document.querySelectorAll(".note").forEach(li => li.remove());
      notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content2">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu2">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
      });
    }
    showNotes();

    function showMenu(elem) {
      elem.parentElement.classList.add("show");
      document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
          elem.parentElement.classList.remove("show");
        }
      });
    }

    function deleteNote(noteId) {
      let confirmDel = confirm("Are you sure you want to delete this note?");
      if(!confirmDel) return;
      notes.splice(noteId, 1);
      localStorage.setItem("notes", JSON.stringify(notes));
      showNotes();
    }

    function updateNote(noteId, title, filterDesc) {
      let description = filterDesc.replaceAll('<br/>', '\r\n');
      updateId = noteId;
      isUpdate = true;
      addBox.click();
      titleTag.value = title;
      descTag.value = description;
      popupTitle.innerText = "Update a Note";
      addBtn.innerText = "Update Note";
    }

    addBtn.addEventListener("click", e => {
      e.preventDefault();
      let title = titleTag.value.trim(),
          description = descTag.value.trim();

      if(title || description) {
        let currentDate = new Date(),
            month = months[currentDate.getMonth()],
            day = currentDate.getDate(),
            year = currentDate.getFullYear();

        let noteInfo = {title, description, date: `${month} ${day}, ${year}`}
        if(!isUpdate) {
          notes.push(noteInfo);
        } else {
          isUpdate = false;
          notes[updateId] = noteInfo;
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
      }
    });
