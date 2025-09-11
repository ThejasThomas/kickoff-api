import { RepositoryRegistry } from "./repository_register";
import { UseCaseRegistry } from "./useCase_registry";


export class DependencyInjection {
    static registerAll() : void{
        UseCaseRegistry.registerUseCases();
         RepositoryRegistry.registerRepositories();
    }
}