module "dojo/aspect" {
    declare namespace aspect {
        function after(target: any, method: string, advice: Function): any;
    }
    export default aspect;
}
