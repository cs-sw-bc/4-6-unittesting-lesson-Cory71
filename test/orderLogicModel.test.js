import { expect } from 'chai';
import {calculateSubtotal, validateCouponCode} from "../src/models/orderLogicModel.js";

describe('Testing orderLogicModel.js', () => {
    
    describe('Testing calculateSubtotal()', () => {
        const menuItems = [
            { name: 'Brewed Coffee', price: 2.75, quantity: 4 },
            { name: 'Cafe Latte', price: 4.5, quantity: 3 },
        ];
        it("Test Case 1:Calculating subtotal 0f two items", () => {
            expect(calculateSubtotal(menuItems)).to.equal(24.5);
        });
        it("Test Case 2:Calculating subtotal of empty items", () => {
            expect(calculateSubtotal([])).to.equal(0);
        });

    })
    describe("Testing validateCouponCode()", () => {
        const coupons = [
            { code: 'SAVE10', type: 'percent', value: 0.1 },
            { code: 'TAKE2', type: 'fixed', value: 2, minSubtotal: 10 },
            { code: 'HOT15', type: 'percent', value: 0.15 },
        ];
        it("Test Case 1:Valid coupon code", () => {
            expect(validateCouponCode('SAVE10', coupons)).to.be.true;

        });
        it("Test Case 2:Invalid coupon code", () => {
            expect(validateCouponCode('INVALID', coupons)).to.be.false;
        });
        it("Test Case 3:Empty coupon code", () => {
            expect(validateCouponCode('', coupons)).to.be.false;
        });
        it("Test Case 4:Validating an valid coupon with lower cases", () => {
            expect(validateCouponCode('hot15', coupons)).to.be.true;
        });
        });
    });