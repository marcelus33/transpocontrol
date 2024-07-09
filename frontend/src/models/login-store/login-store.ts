import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withEnvironment } from "../extensions/with-environment"
import { withRootStore } from "../extensions/with-root-store"

export const LoginStoreModel = types
  .model("LoginStore")
  .extend(withRootStore)
  .extend(withEnvironment)
  .props({
    id: types.maybeNull(types.number),
    email: types.maybeNull(types.string),
    name: types.maybeNull(types.string),

    access_token: types.maybeNull(types.string),
    refresh_token: types.maybeNull(types.string),
  })
  .views((self) => ({
    get isLoggedIn() {
      return !!self.access_token
    },
  }))
  .actions((self) => ({
    setApiToken(token: string | null) {
      const api = self.environment.api.apisauce
      self.access_token = token
      if (token) {
        api?.setHeader("Authorization", "Bearer " + token)
      } else {
        api?.deleteHeader("Authorization")
      }
    },

    setUp() {
      if (self.access_token) {
        self.environment.api.apisauce?.setHeader("Authorization", "Bearer " + self.access_token)
      } else {
        self.environment.api.apisauce?.deleteHeader("Authorization")
      }
    },

    setUser(user: any) {
      self.id = user.id
      self.name = user.name
      self.email = user.email

      self.access_token = user.access_token
      self.refresh_token = user.refresh_token
    },

    reset() {
      const api = self.environment.api.apisauce
      api?.deleteHeader("Authorization")

      self.id = null
      self.email = null
      self.name = null

      self.access_token = null
      self.refresh_token = null
    },
  }))
  .views((store) => ({}))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type LoginStoreType = Instance<typeof LoginStoreModel>

export interface LoginStore extends LoginStoreType {}

type LoginStoreSnapshotType = SnapshotOut<typeof LoginStoreModel>

export interface LoginStoreSnapshot extends LoginStoreSnapshotType {}
