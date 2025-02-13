import * as assert from "assert";

import {
	convertInterfacesToCSharp,
	extractInterfaceName,
	extractProperties,
} from "../index";

suite("Interface conversion tests", () => {
	test("generate classes - multiple interfaces", () => {
		const input = /*typescript*/ `
        interface Beans {
            propOne : string;
            propTwo? : string;
            propThree : number;
            propFour : boolean;
        }

        interface SecondaryClass {
            propertyNumberOne : number[];
            isProperty : boolean;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		let expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public string PropOne;

            [JsonProperty("propTwo")]
            public string PropTwo;

            [JsonProperty("propThree")]
            public int PropThree;

            [JsonProperty("propFour")]
            public bool PropFour;
        }

        public class SecondaryClass {
            [JsonProperty("propertyNumberOne")]
            public IEnumerable<int> PropertyNumberOne;

            [JsonProperty("isProperty")]
            public bool IsProperty;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		let actual = convertInterfacesToCSharp(input)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("generate classes - prefix and suffix", () => {
		const input = /*typescript*/ `
        interface Beans {
            propOne : string;
            propTwo? : string;
            propThree : number;
            propFour : boolean;
        }

        interface SecondaryClass {
            propertyNumberOne : number[];
            isProperty : boolean;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		let expected = `
        public class PrefixBeansSuffix {
            [JsonProperty("propOne")]
            public string PropOne;

            [JsonProperty("propTwo")]
            public string PropTwo;

            [JsonProperty("propThree")]
            public int PropThree;

            [JsonProperty("propFour")]
            public bool PropFour;
        }

        public class PrefixSecondaryClassSuffix {
            [JsonProperty("propertyNumberOne")]
            public IEnumerable<int> PropertyNumberOne;

            [JsonProperty("isProperty")]
            public bool IsProperty;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		let actual = convertInterfacesToCSharp(input, false, "Prefix", "Suffix")
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("generate classes (exports only) - multiple interfaces", () => {
		const input = /*typescript*/ `
        interface Beans {
            propOne : string;
            propTwo? : string;
            propThree : number;
            propFour : boolean;
        }

        export interface SecondaryClass {
            propertyNumberOne : number[];
            isProperty : boolean;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		let expected = `
        public class SecondaryClass {
            [JsonProperty("propertyNumberOne")]
            public IEnumerable<int> PropertyNumberOne;

            [JsonProperty("isProperty")]
            public bool IsProperty;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		let actual = convertInterfacesToCSharp(input, true)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("generate class - primative types", () => {
		const input = /*typescript*/ `
        interface Beans {
            propOne? : string;
            propTwo : string;
            propThree : number;
            propFour : boolean;
        }
        `.replace(/\s+/g, " ");

		let expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public string PropOne;

            [JsonProperty("propTwo")]
            public string PropTwo;

            [JsonProperty("propThree")]
            public int PropThree;

            [JsonProperty("propFour")]
            public bool PropFour;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		let actual = convertInterfacesToCSharp(input)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("generate class - primative lists", () => {
		const input = /*typescript*/ `
        interface Beans {
            propOne : string[];
            propTwo : boolean[];
            propThree : number[];
            propFour? : any[];
        }
        `.replace(/\s+/g, " ");

		let expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public IEnumerable<string> PropOne;

            [JsonProperty("propTwo")]
            public IEnumerable<bool> PropTwo;

            [JsonProperty("propThree")]
            public IEnumerable<int> PropThree;

            [JsonProperty("propFour")]
            public IEnumerable<object> PropFour;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		let actual = convertInterfacesToCSharp(input)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("generate class - custom object", () => {
		const input = /*typescript*/ `
        interface Beans {
            propOne : CustomClass;
        }
        `.replace(/\s+/g, " ");

		let expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public CustomClass PropOne;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		let actual = convertInterfacesToCSharp(input)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("generate class - custom object list", () => {
		const input = /*typescript*/ `
        interface Beans {
            propOne : CustomClass[];
        }
        `.replace(/\s+/g, " ");

		let expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public IEnumerable<CustomClass> PropOne;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		let actual = convertInterfacesToCSharp(input)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("generate class - empty interface", () => {
		const input = /*typescript*/ `
        interface Beans {
        }
        `.replace(/\s+/g, " ");

		let expected = `
        public class Beans {
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		let actual = convertInterfacesToCSharp(input)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("extract name", () => {
		const input = /*typescript*/ `
        interface Beans {
        }
        `.replace(/\s+/g, " ");

		let expected = "Beans";

		let actual = extractInterfaceName(input);

		assert.deepEqual(actual, expected);
	});

	test("extract property - primative", () => {
		const input = /*typescript*/ `
        interface Beans {
            propertyOne : string;
        }
        `.replace(/\s+/g, " ");

		let expected = [{ property: "propertyOne", type: "string" }];

		let actual = extractProperties(input);

		assert.deepEqual(actual, expected);
	});
});

suite("Class conversion tests", () => {
	test("generate classes - multiple interfaces", () => {
		const input = /*typescript*/ `
        class Beans {
            propOne : string;
            propTwo? : string;
            propThree : number;
            propFour : boolean;
        }

        class SecondaryClass {
            propertyNumberOne : number[];
            isProperty : boolean;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		const expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public string PropOne;

            [JsonProperty("propTwo")]
            public string PropTwo;

            [JsonProperty("propThree")]
            public int PropThree;

            [JsonProperty("propFour")]
            public bool PropFour;
        }

        public class SecondaryClass {
            [JsonProperty("propertyNumberOne")]
            public IEnumerable<int> PropertyNumberOne;

            [JsonProperty("isProperty")]
            public bool IsProperty;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		const actual = convertInterfacesToCSharp(input)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("generate classes - prefix and suffix", () => {
		const input = /*typescript*/ `
        class Beans {
            propOne : string;
            propTwo? : string;
            propThree : number;
            propFour : boolean;
        }

        class SecondaryClass {
            propertyNumberOne : number[];
            isProperty : boolean;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		const expected = `
        public class PrefixBeansSuffix {
            [JsonProperty("propOne")]
            public string PropOne;

            [JsonProperty("propTwo")]
            public string PropTwo;

            [JsonProperty("propThree")]
            public int PropThree;

            [JsonProperty("propFour")]
            public bool PropFour;
        }

        public class PrefixSecondaryClassSuffix {
            [JsonProperty("propertyNumberOne")]
            public IEnumerable<int> PropertyNumberOne;

            [JsonProperty("isProperty")]
            public bool IsProperty;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		const actual = convertInterfacesToCSharp(
			input,
			false,
			"Prefix",
			"Suffix"
		)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("generate classes (exports only) - multiple interfaces", () => {
		const input = /*typescript*/ `
        class Beans {
            propOne : string;
            propTwo? : string;
            propThree : number;
            propFour : boolean;
        }

        export class SecondaryClass {
            propertyNumberOne : number[];
            isProperty : boolean;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		const expected = `
        public class SecondaryClass {
            [JsonProperty("propertyNumberOne")]
            public IEnumerable<int> PropertyNumberOne;

            [JsonProperty("isProperty")]
            public bool IsProperty;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		const actual = convertInterfacesToCSharp(input, true)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("generate class - primative types", () => {
		const input = /*typescript*/ `
        class Beans {
            propOne? : string;
            propTwo : string;
            propThree : number;
            propFour : boolean;
        }
        `.replace(/\s+/g, " ");

		const expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public string PropOne;

            [JsonProperty("propTwo")]
            public string PropTwo;

            [JsonProperty("propThree")]
            public int PropThree;

            [JsonProperty("propFour")]
            public bool PropFour;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		const actual = convertInterfacesToCSharp(input)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("generate class - primative lists", () => {
		const input = /*typescript*/ `
        class Beans {
            propOne : string[];
            propTwo : boolean[];
            propThree : number[];
            propFour? : any[];
        }
        `.replace(/\s+/g, " ");

		const expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public IEnumerable<string> PropOne;

            [JsonProperty("propTwo")]
            public IEnumerable<bool> PropTwo;

            [JsonProperty("propThree")]
            public IEnumerable<int> PropThree;

            [JsonProperty("propFour")]
            public IEnumerable<object> PropFour;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		const actual = convertInterfacesToCSharp(input)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("generate class - custom object", () => {
		const input = /*typescript*/ `
        class Beans {
            propOne : CustomClass;
        }
        `.replace(/\s+/g, " ");

		const expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public CustomClass PropOne;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		const actual = convertInterfacesToCSharp(input)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("generate class - custom object list", () => {
		const input = /*typescript*/ `
        class Beans {
            propOne : CustomClass[];
        }
        `.replace(/\s+/g, " ");

		const expected = `
        public class Beans {
            [JsonProperty("propOne")]
            public IEnumerable<CustomClass> PropOne;
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		const actual = convertInterfacesToCSharp(input)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("generate class - empty interface", () => {
		const input = /*typescript*/ `
        class Beans {
        }
        `.replace(/\s+/g, " ");

		const expected = `
        public class Beans {
        }
        `
			.replace(/\s+/g, " ")
			.trim();

		const actual = convertInterfacesToCSharp(input)
			.replace(/\s+/g, " ")
			.trim();

		assert.deepEqual(actual, expected);
	});

	test("extract name", () => {
		const input = /*typescript*/ `
        class Beans {
        }
        `.replace(/\s+/g, " ");

		const expected = "Beans";

		const actual = extractInterfaceName(input);

		assert.deepEqual(actual, expected);
	});

	test("extract property - primative", () => {
		const input = /*typescript*/ `
        class Beans {
            propertyOne : string;
        }
        `.replace(/\s+/g, " ");

		const expected = [{ property: "propertyOne", type: "string" }];

		const actual = extractProperties(input);

		assert.deepEqual(actual, expected);
	});

	test("extract property - list", () => {
		const input = /*typescript*/ `
        class Beans {
            propertyOne : string[];
        }
        `.replace(/\s+/g, " ");

		const expected = [{ property: "propertyOne", type: "string[]" }];

		const actual = extractProperties(input);

		assert.deepEqual(actual, expected);
	});

	test("extract property - list", () => {
		const input = /*typescript*/ `
        interface Beans {
            propertyOne : string[];
        }
        `.replace(/\s+/g, " ");

		let expected = [{ property: "propertyOne", type: "string[]" }];

		let actual = extractProperties(input);

		assert.deepEqual(actual, expected);
	});

	/** Covers bug #11 */
	test("generate class - properties with numbers", () => {
		const input = /*typescript*/ `
export interface IAddress {
    Id2132132213: number;
    Name: string;
    AddressLine1: string;
    AddressLine2: string;
    Number: string;
}`;

		const interfaceName = extractInterfaceName(input);
		const properties = extractProperties(input);
		const aaa = convertInterfacesToCSharp(input);

		assert.notStrictEqual(aaa, "");
		assert.strictEqual(interfaceName, "IAddress");
		assert.strictEqual(properties.length, 19);
	});
});
