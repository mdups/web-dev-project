(function () {
let users = []


const deleteUser = (event) => {
  const deleteBtn = event.currentTarget
  const $deleteBtn = $(deleteBtn)
  const parent = $deleteBtn.parents("tr")
  parent.remove()
}

const deleteUser2 = (index) => {
  const user = users[index]
  const userId = user._id
  userService.deleteUser(userId)
    .then(status => {
      console.log(status)
      users.splice(index, 1)
      renderUsers(users)
    })
}

let selectedUserIndex = -1
const selectUser = (index) => {
  cancelOrCommitChangeOptions()
  selectedUserIndex = index
  $("#usernameFld").val(users[index].username)
  $("#passwordFld").val(users[index].password)
  $("#firstNameFld").val(users[index].first)
  $("#lastNameFld").val(users[index].last)
  $("#roleFld").val(users[index].role)

}

let $template
let tbody
let buttonParent

const clearInputFields = () => {
  $("#usernameFld").val('')
  $("#passwordFld").val('')
  $("#firstNameFld").val('')
  $("#lastNameFld").val('')
  $("#roleFld").val('EMPTY')
}

function renderUsers(users) {

  tbody.empty()
  clearInputFields()

  for(let i=0; i<users.length; i++) {
    const user = users[i]
    const username = user.username
    const password = user.password
    const fName = user.first
    const lName = user.last
    const role = user.role

    const $clone = $template.clone()

    $clone.removeClass("wbdv-hidden")

    const $username = $clone.find(".wbdv-username")
    $username.html(username)
    const $password = $clone.find(".wbdv-password")
    $password.html(password)
    const $firstName = $clone.find(".wbdv-first-name")
    $firstName.html(fName)
    const $lastName = $clone.find(".wbdv-last-name")
    $lastName.html(lName)
    const $role = $clone.find(".wbdv-role")
    $role.html(role)

    const $removeBtn = $clone.find(".wbdv-remove")
    $removeBtn.click(() => deleteUser2(i))
    $clone
      .find(".wbdv-select")
      .click(() => selectUser(i))

    tbody.append($clone)
  }
}

const cancelOrCommitChangeOptions = () => {

  buttonParent.empty()
  buttonParent.append("<i class=\"fa-2x fa fa-check wbdv-update\"></i>")
  buttonParent.append("<i class=\"fa-2x fa fa-ban wbdv-cancel\" ></i>")
}

const createUser = () => {
  const username = $("#usernameFld").val()
  const password = $("#passwordFld").val()
  const first = $("#firstNameFld").val()
  const last = $("#lastNameFld").val()
  const role = $("#roleFld").val()
  const newUser = {
    username,
    password,
    first,
    last,
    role
  }
  userService.createUser(newUser)
    .then(actualInsertedUser => {
      users.push(actualInsertedUser)
      renderUsers(users)
    })
}

const updateUser = () => {
  const updatedFields = {
    username: $("#usernameFld").val(),
    password: $("#passwordFld").val(),
    first: $("#firstNameFld").val(),
    last: $("#lastNameFld").val(),
    role: $("#roleFld").val()

  }
  const userId = users[selectedUserIndex]._id
  userService.updateUser(userId, updatedFields)
    .then(status => {
      users[selectedUserIndex] = updatedFields
      renderUsers(users)
      cancelEdit()
    })
}
const cancelEdit = () => {
  clearInputFields()
  buttonParent.empty()
  buttonParent.append("<i class=\"fa-2x fa fa-search wbdv-search\"></i>")
  buttonParent.append("<i class=\"fa-2x fa fa-plus wbdv-create\"></i>")
}

function init() {
  $template = $(".wbdv-template")
  tbody = $("tbody.wbdv-tbody")
  buttonParent = $(".wbdv-button-parent")
  buttonParent.delegate(".wbdv-create", "click", createUser)
  buttonParent.delegate(".wbdv-update", "click", updateUser)
  buttonParent.delegate(".wbdv-cancel", "click", cancelEdit)


  userService.findAllUsers()
    .then(_users => {
      console.log(_users)
      users = _users
      renderUsers(users)
    })
}

jQuery(init)

})()