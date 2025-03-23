describe('Task List Tests', () => {
  beforeEach(() => {
    // Visit using the configured baseUrl
    console.log(Cypress.config())
    cy.visit('/')
    cy.get('input[placeholder="Username"]').type(Cypress.env('TEST_USER'))
    cy.get('input[placeholder="Password"]').type(Cypress.env('TEST_PASSWORD'))
    cy.get('button').contains('Login').click()
    
    // Wait for redirect to tasks page
    cy.url().should('include', '/tasks')
  })

  it('should create a new task', () => {
    const taskTitle = 'Test Task'
    const taskDescription = 'This is a test task description'

    cy.get('input[placeholder="Task title"]').type(taskTitle)
    cy.get('textarea[placeholder="Task description"]').type(taskDescription)
    cy.get('button').contains('Add Task').click()

    // Verify task was created
    cy.contains(taskTitle)
    cy.contains(taskDescription)
  })

  it('should update task status', () => {
    // Create a task first
    cy.get('input[placeholder="Task title"]').type('Status Test Task')
    cy.get('button').contains('Add Task').click()

    // Change status to In Progress
    cy.contains('Start').click()
    cy.contains('In Progress')

    // Complete the task
    cy.contains('Complete').click()
    cy.contains('Completed')
  })

  it('should delete a task', () => {
    const taskTitle = 'Task to Delete'

    // Create a task
    cy.get('input[placeholder="Task title"]').type(taskTitle)
    cy.get('button').contains('Add Task').click()

    // Verify task exists
    cy.contains(taskTitle)

    // Delete the task
    cy.get('button').find('[data-testid="trash-2"]').click()

    // Verify task was deleted
    cy.contains(taskTitle).should('not.exist')
  })

  it('should navigate to analytics page', () => {
    cy.contains('View Task Analytics').click()
    cy.url().should('include', '/chart')
  })

  it('should handle logout', () => {
    cy.get('button').find('[data-testid="log-out"]').click()
    cy.url().should('equal', '/')
  })

  it('should refresh task list', () => {
    cy.contains('Refresh Tasks').click()
    cy.get('.animate-spin').should('exist')
    cy.get('.animate-spin').should('not.exist')
  })
})