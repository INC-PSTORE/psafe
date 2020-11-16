/*
* table Pagination
*/

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import React from 'react';
import {compose} from 'redux';
import styles from './styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import { DEFAULT_ETH_ADDRESS } from '../../common/constants';

/* eslint-disable react/prefer-stateless-function */
export class NewWalletModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleUpdateOwnersByid = this.handleUpdateOwnersByid.bind(this);
    this.handlerUpdateRequirement = this.handlerUpdateRequirement.bind(this);
    this.addOwner = this.addOwner.bind(this);
    this.removeOwner = this.removeOwner.bind(this);
    this.createNewWalletHandler = this.createNewWalletHandler.bind(this);
  }

  handleOpen = () => {
    const {updateModal} = this.props;
    updateModal(1, true);
  };

  handleClose = () => {
    const {updateModal} = this.props;
    updateModal(1, false);
  };

  handleUpdateOwnersByid(event) {
    const {updateNewWalletModalForm, newWalletModalForm} = this.props;
    let splitId = event.target.id.split("_");
    let id = Number(splitId[splitId.length - 1]);
    if (newWalletModalForm && newWalletModalForm.owners && id < newWalletModalForm.owners.length) {
      newWalletModalForm.owners[id] = event.target.value;
      updateNewWalletModalForm(newWalletModalForm);
    }
  }

  handlerUpdateRequirement(event) {
    const {updateNewWalletModalForm, newWalletModalForm} = this.props;
    if (newWalletModalForm && newWalletModalForm.owners && Number(event.target.value) <= newWalletModalForm.owners.length) {
      newWalletModalForm.requirement = Number(event.target.value);
      updateNewWalletModalForm(newWalletModalForm);
    }
  }

  addOwner() {
    const {newWalletModalForm, updateNewWalletModalForm} = this.props;
    if (newWalletModalForm && newWalletModalForm.owners) {
      newWalletModalForm.owners.push(DEFAULT_ETH_ADDRESS);
      updateNewWalletModalForm(newWalletModalForm);
    }
  }

  removeOwner() {
    const {newWalletModalForm, updateNewWalletModalForm} = this.props;
    if (newWalletModalForm && newWalletModalForm.owners) {
      newWalletModalForm.owners.pop();
      updateNewWalletModalForm(newWalletModalForm);
    }
  }

  createNewWalletHandler() {
    const {newWalletModalForm, ethAccount, creatNewWallet} = this.props;
    if (newWalletModalForm &&  newWalletModalForm.requirement) {
      creatNewWallet(ethAccount, newWalletModalForm);
    }
  }

  render() {
    const {classes, isNewWalletOpen, newWalletModalForm} = this.props;

    return (
      <div className={classes.newWallet}>
        <Button onClick={this.handleOpen} className={classes.newWalletButton} color="primary">
          <AddIcon />
          New Wallet
        </Button>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={isNewWalletOpen}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isNewWalletOpen}>
            <div className={classes.paper}>
              <div className={classes.ownerButtons}>
                <IconButton onClick={this.addOwner} className={classes.ownerButton} color="primary">
                  <Icon fontSize="small">add</Icon>
                </IconButton>
                {
                  newWalletModalForm && newWalletModalForm.owners && newWalletModalForm.owners.length > 1 &&
                  <IconButton onClick={this.removeOwner} className={classes.ownerButton} color="primary">
                    <Icon fontSize="small">remove</Icon>
                  </IconButton>
                }
              </div>

              <form className={classes.formStyle} noValidate autoComplete="off">
                {
                  newWalletModalForm &&
                  newWalletModalForm.owners &&
                  newWalletModalForm.owners.map((item, i) => {
                    return (
                      <TextField
                        key={'owner_' + i}
                        id={'owner_' + i}
                        onChange={this.handleUpdateOwnersByid}
                        label={`Owner address ${i+1}`}
                        value={
                          newWalletModalForm.owners[i] !== DEFAULT_ETH_ADDRESS ?
                          newWalletModalForm.owners[i] :
                          ''
                        }
                      />
                    )}
                  )
                }

                <TextField
                  onChange={this.handlerUpdateRequirement}
                  id="Requirement"
                  label="Minimum signatures required"
                  type="number"
                  value={newWalletModalForm && newWalletModalForm.requirement ? newWalletModalForm.requirement : ''}
                />

              </form>

              <div className={classes.actionsButtons}>
                <Button
                  onClick={this.handleClose}
                  className={classes.actionsButton}
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={this.createNewWalletHandler}
                  className={classes.actionsButton}
                  variant="contained"
                  color="primary"
                >
                  Create
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  }
}

const withMyStylesNewWallet = withStyles(styles);

export default compose(withMyStylesNewWallet)(NewWalletModal);
