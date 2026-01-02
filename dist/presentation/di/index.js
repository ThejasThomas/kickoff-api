"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyInjection = void 0;
const repository_register_1 = require("./repository_register");
const useCase_registry_1 = require("./useCase_registry");
class DependencyInjection {
    static registerAll() {
        useCase_registry_1.UseCaseRegistry.registerUseCases();
        repository_register_1.RepositoryRegistry.registerRepositories();
    }
}
exports.DependencyInjection = DependencyInjection;
