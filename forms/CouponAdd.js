import React from 'react'
import FieldWithElement from '../components/FieldWithElement';
import DatePicker from "react-datepicker";
import {Formik} from 'formik';
import ErrorHandler from "../helpers/ErrorHandler";
import * as controller from '../controllers/v2/couponsV2'
import userController from "../controllers/users";
import Swal from "sweetalert2";
import AsyncSelect from "react-select/async";
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";


const addCouponSchema = Yup.object().shape({
	authority_doc: Yup.string()
	    .required('Description is required'),
	code: Yup.string()
	    .required('Code is required'),
	category: Yup.string()
	    .required('Category is required'),
	sub_category: Yup.number()
		.typeError('Sub Category is required')
	    .required('Sub Category is required'),
	organization_id: Yup.number()
	    .required('Organization is required'),
	mode: Yup.string()
		.required('Mode is required'),
	amount: Yup.number().when('mode', {
			is: (val) => val == "flat",
			then: Yup.number()
				.typeError('Discount is required')
				.required('Discount is required'),
			otherwise: Yup.number().nullable().notRequired()
		}),
	percentage: Yup.number().when('mode', {
			is: (val) => val == "percentage",
			then: Yup.number()
			.typeError('Percentage is required')
			.required('Percentage is required'),
			otherwise: Yup.number().nullable().notRequired()
		}),
	applicable_all_users: Yup.boolean()
		.required("Field is required."),
	user_id: Yup.number().when('applicable_all_users', {
			is: (val) => val == false,
			then: Yup.number()
				.typeError('User is required')
				.required('User is required'),
			otherwise: Yup.number().nullable().notRequired()
		}),
});


class AddCouponForm extends React.Component {

	constructor(props) {
		super(props)
	}

	setRandomCouponCode = (event) => {
        return controller.generateRandomCouponCode()
	}

	mapResponseToResults = (response) => {
        return response.map(user => ({
            value: user.email,
            label: `Email: ${user.email} Username: ${user.username}`,
            user_id: `${user.id}`
        }));
    };

	loadOptions = (inputValue, callback) => {
        if (inputValue) {
            userController.handleGetUserByEmailOrPhone("email", inputValue).then((response) => {
                callback(this.mapResponseToResults(response.data));
            }).catch((error) => {
                ErrorHandler.handle(error)
                callback([]);
            })
        }
    };

    renameKeys = (keysMap, obj) => Object
        .keys(obj)
        .reduce((acc, key) => ({
            ...acc,
            ...{[keysMap[key] || key]: obj[key]}
        }), {});

    submitFormShowingSweetAlert = (formValues) => {
        Swal.fire({
            title: "Create new coupon?",
            html: `Code: ${formValues.code}<br/>Category : ${
                formValues.category
            } `,
            confirmButtonColor: "#f66",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!",
            showCancelButton: true,
            showConfirmButton: true,
            showCloseButton: true
        }).then((result) => {
            if (result.value) {
                controller.handleAddCoupon(formValues).then(res => {
                    Swal.fire({
                        title: "Coupon added!",
                        type: "success",
                        timer: "3000",
                        showConfirmButton: true,
                        confirmButtonText: "Okay"
                    });
                }).catch(error => {
                    Swal.fire({
                        title: "Error while adding coupon!",
                        type: "error",
                        text: error
                    });
                });
            }
        });
    }

    render() {
        return (
            <div>
            	<div className={"border-card coupon-card col-md-9 offset-2 mt-5 mb-5"}>
	            	<Formik
                        initialValues={{
                            authority_doc: "",
			                code: "",
			                organization_id: 1,
			                type: "online",
			                mode: "flat",
			                left: 1,
			                category: "",
			                sub_category: null,
			                active: false,
			                applicable_all_users: true,
			                max_discount: null,
			                percentage: null,
			                amount: null,
			                user_id: null,
			                valid_start: Date.now(),
			                valid_end: new Date().setMonth(new Date().getMonth() + 1)
                        }}
                        validationSchema={addCouponSchema}
                        onSubmit={(values, {setSubmitting}) => {
                            const keysMap = {
                                authority_doc: 'authority_doc',
                                code: 'code',
                                organization_id: 'organization_id',
                                type: 'type',
                                mode: 'mode',
                                left: 'left',
                                category: 'category',
                                sub_category: 'sub_category',
                                active: 'active',
                                applicable_all_users: 'applicable_all_users',
                                amount: 'amount',
                                max_discount: 'max_discount',
			                	percentage: 'percentage',
                                user_id: 'user_id',
                                valid_start: 'valid_start',
                                valid_end: 'valid_end'
                            };
                            this.submitFormShowingSweetAlert(this.renameKeys(keysMap, values))
	                        }}
	                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              isSubmitting,
                              setFieldValue
                          }) => (

                          	<form id="add_coupon_form" onSubmit={handleSubmit}>
			                    <div className={"add-coupon-card"}>
			                        {/* organization */}
			                        <FieldWithElement name={"Organization"} nameCols={3} elementCols={9}
			                                          elementClassName={"pl-4"}>
			                            <select
			                                id="organization_id"
			                                name="organization_id"
			                                onChange={(e) => {
                                                handleChange(e)
                                                this.props.onOrganizationChange(e)
                                            }}
	                                        value={values.organization_id}
			                                required>
			                                {
			                                    this.props.data.organizations.map((organization) => {
			                                        return (
			                                            <option value={Number(organization.id)} key={organization.id}>
			                                                {organization.name}
			                                            </option>)
			                                    })
			                                }
			                            </select>
			                        </FieldWithElement>

			                        {/* Code */}
			                        <FieldWithElement name={"Code*"} nameCols={3} elementCols={9}
			                                        elementClassName={"pl-4"}  errorColor={'tomato'}
                                    				errors={touched.code && errors.code}>
			                            <input
			                                type="text"
			                                id="code"
			                                className="input-text"
			                                placeholder="Enter Code"
			                                name="code"
			                                value={values.code}
			                                onBlur={handleBlur}
			                                onChange={handleChange}
			                                required
			                            />
			                            <span id="random_coupon" className="red pull-right mt-4"
			                                            onClick={() => setFieldValue("code", this.setRandomCouponCode())}>
			                            	Generate Random Code
			                            </span>
			                        </FieldWithElement>

			                        {/* Authority_code */}
			                        <FieldWithElement name={"Description*"} nameCols={3} elementCols={9}
			                                          elementClassName={"pl-4"} errors={touched.authority_doc && errors.authority_doc}  
			                                          errorColor={'tomato'}>
			                            <textarea
			                                type="text"
			                                className="input-textarea"
			                                placeholder="Enter Description"
			                                name="authority_doc"
			                                rows="4"
			                                value={values.authority_doc}
			                                onBlur={handleBlur}
			                                onChange={handleChange}
			                                required
			                            />
			                        </FieldWithElement>

			                        {/* Categories */}
			                        <FieldWithElement name={"Category"} nameCols={3} elementCols={9}
			                                          elementClassName={"pl-4"} errorColor={'tomato'}
                                    				errors={touched.category && errors.category}>
			                            <select
			                                id="category"
			                                name="category"
			                                onBlur={handleBlur}
			                                onChange={() => setFieldValue("category", this.props.handleCategoryChange(event))}
			                                value={values.category}>
			                                {
			                                    this.props.data.categories.map((category) => {
			                                        return (
			                                            <option value={category}>
			                                                {category}
			                                            </option>)
			                                    })
			                                }
			                            </select>
			                        </FieldWithElement>

			                         {/* Sub Categories */}
			                        <FieldWithElement name={"Sub Category"} nameCols={3} elementCols={9}
			                                          elementClassName={"pl-4"} errorColor={'tomato'}
                                    				errors={touched.sub_category && errors.sub_category}>
			                            <select
			                                id="sub_category"
			                                name="sub_category"
			                                onBlur={handleBlur}
			                                onChange={() => setFieldValue("sub_category", this.props.handleSubCategoryChange(event, values.category))}
			                            	required>
				                            
				                            <option value="" key="">Select </option>
			                            	{
			                                    this.props.data.subCategories.map((subcategory) => {
			                                        return (
				                                        <option value={Number(subcategory.id)} key={subcategory.id}>
				                                            {subcategory.name}
				                                        </option>)
			                                    })
			                                }
			                            </select>
			                        </FieldWithElement>

			                        {/* Start Date */}
			                        <FieldWithElement name={"Start Date"} nameCols={3} elementCols={9}
			                                          elementClassName={"pl-4"}>
			                            <DatePicker
			                                showTimeSelect
			                                timeFormat="HH:mm:ss"
			                                timeIntervals={60}
			                                timeCaption="time"
			                                minDate ={new Date()}
			                                onChange={date => setFieldValue('valid_start', date)}
			                                dateFormat="MMMM d, yyyy h:mm aa"
			                                selected={values.valid_start}
			                            />
			                        </FieldWithElement>

			                        {/* End Date */}
			                        <FieldWithElement name={"End Date"} nameCols={3} elementCols={9}
			                                        elementClassName={"pl-4"}>
			                            <DatePicker
			                                showTimeSelect
			                                timeFormat="HH:mm:ss"
			                                timeIntervals={60}
			                                minDate ={new Date()}
			                                onChange={date => setFieldValue('valid_end', date)}
			                                timeCaption="time"
			                                dateFormat="MMMM d, yyyy h:mm aa"
			                                selected={values.valid_end}
			                            />
			                        </FieldWithElement>

			                        {/* Mode */}
			                        <FieldWithElement name={"Mode*"} nameCols={3} elementCols={9}
			                                        elementClassName={"pl-4"} errorColor={'tomato'}
                                    				errors={touched.mode && errors.mode}>
			                            <select
			                                id="mode"
			                                name="mode"
    			                            onBlur={handleBlur}
			                                onChange={handleChange}
			                                value={values.mode}
			                                required
			                                >
			                                <option value="flat">Flat</option>
			                                <option value="percentage">Percentage</option>
			                            </select>
			                        </FieldWithElement>

			                        {values.mode == "flat" &&
			                        /* Amount */
			                        <FieldWithElement
			                            name={"Discount*"}
			                            nameCols={3} elementCols={9} elementClassName={"pl-4"} 
			                            errorColor={'tomato'} errors={touched.amount && errors.amount}>
			                            <input
			                                type="number"
			                                className={"input-text"}
			                                placeholder="Enter discount value"
			                                name="amount"
			                                onBlur={handleBlur}
			                                onChange={handleChange}
			                                value={values.amount}
			                            />
			                        </FieldWithElement>
			                        }

			                        {values.mode == "percentage" &&
			                        /* Percentage */
			                        <div>
			                            <FieldWithElement
			                                name={"Percentage*"}
			                                nameCols={3} elementCols={9} elementClassName={"pl-4"}
			                                errorColor={'tomato'} errors={touched.percentage && errors.percentage}>
			                                <input
			                                    type="number"
			                                    className={"input-text"}
			                                    placeholder="Enter Percentage"
			                                    name="percentage"
			                                    onBlur={handleBlur}
			                                    onChange={handleChange}
			                                    value={values.percentage}
			                                />
			                            </FieldWithElement>

			                            <FieldWithElement
			                                name={"Max discount"}
			                                nameCols={3} elementCols={9} elementClassName={"pl-4"}>
			                                <input
			                                    type="number"
			                                    className={"input-text"}
			                                    placeholder="Enter Max Discount Applicable"
			                                    name="max_discount"
			                                    onBlur={handleBlur}
			                                    onChange={handleChange}
			                                    value={values.max_discount}
			                                />
			                            </FieldWithElement>
			                        </div>
			                        }

			                         {/* Total number of times a coupon can be used*/}
			                        <FieldWithElement name={"How many times it can be used?*"} nameCols={6}
			                                          elementCols={6} elementClassName={"pl-4"}>
			                            <input
			                                type="number"
			                                className={"input-text"}
			                                placeholder="Enter Left"
			                                name="left"
			                                onChange={handleChange}
			                                value={values.left}
			                                min={1}
			                                title="Left can only have numbers"
			                                required
			                            />
			                        </FieldWithElement>

			                        {/* All User */}
				                    <div className={"mt-3 row d-flex"}>
				                        <div className={"col-md-6"}>
				                            <span className="text">Applicable for All Users?</span>
				                        </div>
				                        <div className={"col-md-6"}>
				                            <input
				                            	name="applicable_all_users"
				                                className={"ml-4 mt-3"}
				                                type="checkbox"
				                                checked={values.applicable_all_users}
			                                	onChange={() => setFieldValue("applicable_all_users", !values.applicable_all_users )}
				                                value={values.applicable_all_users}/>
				                        </div>
				                    </div>


			                        {!values.applicable_all_users &&
			                        /* User */
			                        <FieldWithElement name={"User*"} nameCols={3} elementCols={9}
			                                          elementClassName={"pl-4"} errorColor={'tomato'} 
			                                          errors={touched.user_id && errors.user_id}>
			                            <AsyncSelect
			                            	name="user_id"
	                                        cacheOptions
	                                        defaultOptions
	                                        placeholder="Start typing email to get suggestions"
	                                        loadOptions={this.loadOptions}
	                                        onBlur={handleBlur}
	                                        onChange={(opt) => setFieldValue("user_id", parseInt(opt.user_id))}
	                                        />
			                        </FieldWithElement>        
			                        }

				                   <div className={"d-flex justify-content-center"}>
                                        <button
                                            id="submit_btn"
                                            type="submit"
                                            className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                                        >
                                            Add Coupon
                                        </button>
                                    </div>
			                    </div>
			                </form>
                        )}
                    </Formik>
            	</div>
            </div>
        )
    }
}

export default AddCouponForm
