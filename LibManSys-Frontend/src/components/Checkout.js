// Checkout js

import Router from "../router/index"

import axios from 'axios'
var config = require('../../config')
var frontendUrl
var backendUrl
if (process.env.NODE_ENV === "production") {
  console.log("prod env")
  frontendUrl = 'https://' + config.build.host + ':' + config.build.port
  backendUrl = 'https://' + config.build.backendHost + ':' + config.build.backendPort

} else if (process.env.NODE_ENV === "development") {
  console.log("dev env")
  frontendUrl = 'http://' + config.dev.host + ':' + config.dev.port
  backendUrl = 'http://' + config.dev.backendHost + ':' + config.dev.backendPort
}
var AXIOS = axios.create({
    baseURL: backendUrl,
    headers: { 'Access-Control-Allow-Origin': frontendUrl }
})

function LoanDto(borrowedDate, returnDate, lateFees, loanStatus, loanId,
	libraryItem, member, librarian) {
        
	this.borrowedDate = borrowedDate;
	this.returnDate = returnDate;
	this.lateFees = lateFees;
	this.loanStatus = loanStatus;
	this.loanId = loanId;
	this.libraryItem = libraryItem;
	this.member = member;
	this.librarian = librarian;
}

export default {
    data() {
        return {
            loans: [],
            
            newLoan: '',
            errorCheckout: '',
            employeeId: '',
            libCardNumber: '',
            libraryItemId: '',
            response: [],

            
            loggedInUser: '',
            loggedInType: '',

            loan: undefined
        }
    },
    created: function() {
        // check if cookie is set for current user
        var userLoggedIn = $cookies.isKey("loggedInUser")
        if (userLoggedIn == true) {
            this.loggedInUser = $cookies.get("loggedInUser")
            this.loggedInType = $cookies.get("loggedInType")
        }
    },
    computed: {
        // Return true if any inputs are missing
        isInputMissing() {
            return !this.libCardNumber || !this.libraryItemId;
        }
    },
    methods: {
        checkoutItem: function (libCardNumber, libraryItemId) {
            console.log("eid: " + libCardNumber)
            AXIOS.post('/library-item/checkout', {}, { 
                 params: {
                     employeeID: this.loggedInUser,
                     libCardNumber: libCardNumber,
                     libraryItemID: libraryItemId
                 }
            })
            .then(response => {
                this.errorCheckout = ''
                this.employeeId = ''
                this.libCardNumber = ''
                this.libraryItemId = ''
                this.loan = response.data
            })
            .catch(error => {
                var errorMsg = error
                if ( error.response ) {
                    errorMsg = error.response.data
                }
                console.log(errorMsg)
                this.errorCheckout = errorMsg
            })
        },
        
        
        // navigation functions
        goToSubmitPage: function() {
            Router.push({
                path: "/LibraryManagementDashboard",
                name: "LibraryManagementDashboard"
            })
        },
        goToSearchPage: function() {
            Router.push({
                path: "/SearchLibItems",
                name: "SearchLibItems"
            })
        },
        goToRegisterPage: function() {
            Router.push({
                path: "/Register",
                name: "Register"
            })
        },
        goToLoginPage: function() {
            Router.push({
                path: "/MemberLogin",
                name: "MemberLogin"
            })
        }
    }
}