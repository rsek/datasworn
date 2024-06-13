import { validate as oracle_rollable } from './OracleRollable.js';
import { validate as oracle_collection } from './OracleCollection.js';
declare const Validators: {
    readonly oracle_rollable: typeof oracle_rollable;
    readonly oracle_collection: typeof oracle_collection;
};
export default Validators;
